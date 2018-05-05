const { _M_ } = require('../modules/');


const BrowserReceptor = (req, res, next) => {
  // populating variables
  res.locals.$$MODE = 'html';
  res.locals.$$SITE = JSON.parse(process.env.$WEBSITE_CONFIGS);
  res.locals.$$VIEW = {
    params: req.params,
    query: req.query,
    route: req.baseUrl + req.path,
    title: res.locals.$$SITE.title,
    flash: { error: req.flash('error'), info: req.flash('info'), action: req.flash('action') },
    user: req.session.user,
  };

  // configuring sessions
  if (!req.session.user && req.session.cookie.expires) req.session.cookie.expires = false;
  if (res.locals.$$VIEW.flash.action[0] !== 'retry') delete req.session.returnTo;

  return req.body.post && ['POST', 'PATCH'].includes(req.method) ? _M_.postNormalizer(req, res, next) : next();
};


const APIReceptor = (req, res, next) => {
  // populating variables
  res.locals.$$MODE = 'api';

  return next();
};


// exports
module.exports = { BrowserReceptor, APIReceptor };
