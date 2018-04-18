const { _U_ } = require('../utilities/');
const { configsModel, postsModel } = require('../../models/');



// main
const generic = async (req, res, next) => {
  // checking website settings in environment variables
  if (!process.env['$WEBSITE_CONFIGS']) configsModel.initialize(() => {
    if(!process.env['$WEBSITE_CONFIGS']) throw new _U_.error.ServerError(90001);
  });

  // populating routing variables                                                                                       // tofix: remove from API route
  res.locals.$$SITE = JSON.parse(process.env['$WEBSITE_CONFIGS']);
  res.locals.$$VIEW = {
    flash   : { error: req.flash('error'), info: req.flash('info'), action: req.flash('action') },
    title   : res.locals.$$SITE.title,
    route   : req.baseUrl + req.path,
    query   : req.query,
    user    : req.session.user,
  };

  // configuring sessions
  if (!req.session.user && req.session.cookie.expires) req.session.cookie.expires = false;
  if (res.locals.$$VIEW.flash.action[0] !== 'retry') delete req.session.returnTo;

  return req.body.post && ['POST', 'PATCH'].includes(req.method) ? postNormalizer(req, res, next) : next();
};


const postNormalizer = async (req, res, next) => {
  if (req.method === 'GET' || !req.body.post) return next();
  const { post } = req.body;

  // canonicalize                                                                                                       // todo: move to error handler
  const checkAndResolveConflict = (str) => postsModel
    .count({ canonical: { $regex: new RegExp(`^${str}(?:-[0-9]+)?$`) }})
    .then(counts => {
      if (counts > 0) return str + '-' + (counts + 1);
      return str;
    });

  // normalize                                                                                                          // todo: only normalize for POST, PATCH (different logic)
  const normalizedPost = {
    ...post,
    featured  : _U_.string.inspectFileURL(post.featured, res.locals.$$SITE.sets.imageTypes, { raw: false }),
    title     : _U_.string.escapeChars(post.title),
    content   : _U_.string.escapeChars(post.content),
    category  : _U_.string.toKebabCase(post.category) || undefined,
    tags      : _U_.string.toKebabCase(post.tags) || undefined,
  };
  if (post.state) normalizedPost.state.forEach(state => normalizedPost[`state.${state}`] = true);
  if (req.method === 'POST') normalizedPost.canonical = await checkAndResolveConflict(_U_.string.toKebabCase(post.title));

  // overwrite
  req.body.post = normalizedPost;

  return next();
};



// exports
module.exports = generic;
