/**
 * start to handle any request
 */
const initialReceptor = (req, res, next) => {
  res.locals.$$SITE = req.app.get('APP_CONFIG');
  if (!res.locals.$$SITE.initialized && !req.url.match(/^\/init/i)) return res.redirect('/init');
  return next();
};


/**
 * start to handle an HTML(browser) request
 */
const browserReceptor = (req, res, next) => {                                                                           // todo: start to load template file from fs? (concurrency)
  // populating variables
  res.locals.$$MODE = 'html';
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
  // populate variables
  res.locals.$$MODE = 'api';

  // setup required headers
  res.set('Access-Control-Allow-Origin', '*');                                                                          // todo: set to allowed domain list
  res.set('Access-Control-Allow-Methods', 'GET, PUT, HEAD, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Cache-Control');
  // res.set('Access-Control-Allow-Credentials', 'true');
  res.set('Access-Control-Max-Age', '600');

  return next();
};


// exports
module.exports = { initialReceptor, browserReceptor, APIReceptor };

Object.defineProperty(module.exports, Symbol.for('__TEST__'), {
  value: {
    ...module.exports,
  },
});
