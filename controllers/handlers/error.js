const { _M_ } = require('../modules/');


// redirect
const redirect = {};

/**
 * redirect to sign-in page
 */
redirect.signInRetry = function signInRetry(req, res) {
  // if signed-out from a authentication required page (silent the resulted error flash)
  if (req.header('Referrer').includes(req.originalUrl)) {
    res.locals.$$VIEW.flash.info.forEach(info => req.flash('info', info));
    delete req.flash('error');
  }

  // label the returning page which only be returned if action is 'retry'
  req.session.returnTo = req.originalUrl;
  req.flash('action', 'retry');
  return res.redirect('/signin');
};

// todo: redirect.persistForm


// terminals
const terminal = {};

terminal.ClientException = function ClientException(err, req, res, next) {
  switch (err.from) {
    case 'BulkWriteError':
      if (err.code === 11000) req.flash('error', 'This username is not available.');
      return res.redirect('back');
    case 'UserExistsError':
      req.flash('error', 'This email have been used.');
      break;
    case 'ValidationError':
    default: {
      req.flash('error', err.message);
    }
  }

  if (!err.from && err.code === 20000) return redirect.signInRetry(req, res);
  return res.redirect('back');
};


terminal.TemplateException = function TemplateException(err, req, res, next) {
  return res.status(500).render('./theme/error', { err });                                                              // todo: log the message and call the admin
};


terminal.HttpException = function HttpException(err, req, res, next) {
  return res.status(err.code).render('./theme/error', { err });
};


// gateway
const exceptionHandler = function exceptionHandler(err, req, res, next) {
  if (['dev', 'test'].includes(process.env.NODE_ENV)) console.log(err.stack);

  return _M_.noCrawlerHeader(req, res, () => {
    if (terminal[err.name]) return terminal[err.name](err, req, res, next);
    return res.render('./theme/error', { err });
  });
};


// exports
module.exports = {
  exceptionHandler,
};

Object.defineProperty(module.exports, Symbol.for('__TEST__'), {
  value: {
    redirect,
    terminal,
    ...module.exports,
  },
});
