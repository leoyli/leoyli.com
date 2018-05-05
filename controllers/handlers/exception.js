const { _U_ } = require('../utilities/');
const { _M_ } = require('../modules/');


// redirect
const redirect = {};

redirect.signInRetry = function signInRetry(req, res) {
  // if logout from a authentication required page
  if (req.get('Referrer') && RegExp('^https?:\\/\\/[^\\/]+(.+$)').exec(req.get('Referrer'))[1] === req.originalUrl) {   // option: generalized this string reading method
    req.flash('info', res.locals.$$VIEW.flash.info.toString());
    delete req.flash('error');
  }

  // label the returning page which only be returned if action is 'retry'
  req.session.returnTo = req.originalUrl;
  req.flash('action', 'retry');
  return res.redirect('/signin');
};


// terminals
const terminal = {};

terminal.ClientException = function ClientException(err, req, res, next) {
  switch (err.from) {
    case 'UserExistsError':
      req.flash('error', 'This email have been used.');
      break;
    case 'ValidationError':
      req.flash('error', err.message);
      break;
    case 'BulkWriteError':
      return terminal.MongoError(err, req, res, next);
    default: {
      req.flash('error', err.message);
    }
  }

  if (!err.from && err.code === 20003) return redirect.signInRetry(req, res);
  return res.redirect('back');
};


terminal.MongoError = function MongoError(err, req, res, next) {
  if (err.code === 11000) req.flash('error', 'This username is not available.');
  return res.redirect('back');
};


terminal.HttpException = function HttpException(err, req, res, next) {
  return _M_.noCrawlerHeader(req, res, () => {
    return res.status(err.code).render('./theme/error', { err });
  });
};


terminal.TemplateException = function TemplateException(err, req, res, next) {
  return _M_.noCrawlerHeader(req, res, () => {
    // todo: log the message and call the admin
    // todo: guidance for the client
    return res.status(500).send(`<h1>${new _U_.error.HttpException(500).message}</h1>`);
  });
};


// gateway
const exceptionHandler = function exceptionHandler(err, req, res, next) {
  if (['dev', 'test'].includes(process.env.NODE_ENV)) console.log(err.stack);
  if (_U_.object.hasOwnKey(_U_.error, err.name) && !!terminal[err.name]) return terminal[err.name](err, req, res, next);
  return res.render('./theme/error', { err });
};


// exports
module.exports = exceptionHandler;
