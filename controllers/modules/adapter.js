const { _U_ } = require('../utilities/');


// modules
const passport = require('passport');
const { PostsModel } = require('../../models/');
const { noCrawlerHeader } = require('./regulator');


/** busboy for multipart form parsing **/
const { parseMultipart } = require('./upload');


/** Mongo aggregation for database fetching **/
const { aggregateFetch } = require('./fetch');


/** passport: populating `req.user` **/
const usePassport = [noCrawlerHeader, passport.initialize(), passport.session()];


/** authentication **/
const isSignedIn = [...usePassport, function isSignedIn(req, res, next) {
  if (!(req.isAuthenticated() && req.session.user)) throw new _U_.error.ClientException(20003);
  return next();
}];


/** authorization **/
const isAuthorized = [...isSignedIn, async function isAuthorized(req, res, next) {
  const [field, val] = req.params.canonical !== undefined
    ? ['canonical', req.params.canonical]
    : ['_id', _U_.string.readMongoId(req.url)];
  if (await PostsModel.count({ [field]: val, 'author._id': req.user._id }) !== 1) {                                     // tofix: find the post first then decide to give or not
    throw new _U_.error.ClientException(20001);
  }
  return next();
}];


/** validation: password formats **/
const passwordValidation = function passwordValidation(req, res, next) {
  if (!req.body.password.new || !req.body.password.confirmed) {
    throw new _U_.error.ClientException(10001);
  } else if (req.body.password.new.toString() !== req.body.password.confirmed.toString()) {
    throw new _U_.error.ClientException(10002);
  } else if (req.body.password.old && (req.body.password.old.toString() === req.body.password.new.toString())) {
    throw new _U_.error.ClientException(10003);
  }
  return next();
};


/** normalizer **/
const postNormalizer = async (req, res, next) => {
  if (req.method === 'GET' || !req.body.post) return next();
  const { post } = req.body;

  // canonicalize                                                                                                       // todo: move to error handler
  const checkAndResolveConflict = (str) => PostsModel
    .count({ canonical: { $regex: new RegExp(`^${str}(?:-[0-9]+)?$`) } })
    .then(counts => {
      if (counts > 0) return `${str}-${counts + 1}`;
      return str;
    });

  // normalize                                                                                                          // todo: only normalize for POST, PATCH (different logic)
  const normalizedPost = {
    ...post,
    featured: _U_.string.inspectFileURL(post.featured, res.locals.$$SITE.sets.imageTypes, { raw: false }),
    category: _U_.string.toKebabCase(post.category) || null,
    content: _U_.string.toEscapedChars(post.content),
    title: _U_.string.toEscapedChars(post.title),
    tags: _U_.string.toKebabCase(post.tags) || null,
  };
  if (post.state) {
    normalizedPost.state.forEach(state => {
      normalizedPost[`state.${state}`] = true;
    });
  }
  if (req.method === 'POST') {
    normalizedPost.canonical = await checkAndResolveConflict(_U_.string.toKebabCase(post.title));
  }

  // overwrite
  req.body.post = normalizedPost;

  return next();
};


// exports
module.exports = {
  postNormalizer,
  parseMultipart,
  aggregateFetch,
  usePassport,
  isSignedIn,
  isAuthorized,
  passwordValidation,
};
