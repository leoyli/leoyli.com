/**
 * start to handle an HTML(browser) request
 */
const browserReceptor = (req, res, next) => {                                                                           // todo: start to load template file from fs? (concurrency)
  // populating variables
  res.locals.$$MODE = 'html';
  res.locals.$$SITE = JSON.parse(process.env.$WEBSITE_CONFIGS);
  res.locals.$$VIEW = {
    flash: { error: req.flash('error'), info: req.flash('info'), action: req.flash('action') },
    route: req.baseUrl + req.path,
    title: res.locals.$$SITE.title,
    user: req.session.user,
    params: req.params,
    query: req.query,
  };

  // housekeeping sessions
  if (res.locals.$$VIEW.flash.action[0] !== 'retry') delete req.session.returnTo;

  return next();
  // return req.body.post && ['POST', 'PATCH'].includes(req.method) ? _M_.postNormalizer(req, res, next) : next();      // tofix: move to other place
};


/**
 * start to handle an API request
 */
const APIReceptor = (req, res, next) => {
  // populating variables
  res.locals.$$MODE = 'api';

  return next();
};


// exports
module.exports = { browserReceptor, APIReceptor };

Object.defineProperty(module.exports, Symbol.for('__TEST__'), {
  value: {
    ...module.exports,
  },
});
