module.exports = exports = { _M_: {} };
const passport = require('passport');



// modules
const { _U_ } = require('../utilities/');
const { postsModel } = require('../../models/');
const { uploadController } = require('./upload');
const { fetchController } = require('./fetch');



// STANDALONE MIDDLEWARE
//// HTTP headers: no crawlers
exports._M_.doNotCrawled = (req, res, next) => {
  res.set('Cache-Control', 'private, max-age=0');
  res.set('x-robots-tag', 'none');
  if (typeof next === 'function') return next();
};

//// HTTP headers: no caches stored
exports._M_.doNotCached = (req, res, next) => {
  res.set('Cache-Control', 'no-store');
  if (typeof next === 'function') return next();
};

//// HTTP headers: API services
exports._M_.APIHttpHeaders = (req, res, next) => {
  res.set('x-robots-tag', 'none');
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, PUT, HEAD, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Cache-Control');
  if (typeof next === 'function') return next();
};

//// case insensitive to access `req.query`
exports._M_.caseInsensitiveQuery = (req, res, next) => {
  req.query = _U_.object.proxyfiedForCaseInsensitiveAccess(req.query);
  if (typeof next === 'function') return next();
};

//// HTML title tag modification
exports._M_.setTitleTag = (title, { append, root } = {}) => (req, res, next) => {
  const sequence = [];
  if (root !== false) sequence.push(res.locals.$$VIEW.title);
  if (append === true) sequence.push(title);
  else sequence.unshift(title);
  res.locals.$$VIEW.title = sequence.join(' - ');
  if (typeof next === 'function') return next();
};



// FUNCTIONAL MIDDLEWARE
//// busboy for multipart form parsing
exports._M_.parseMultipart = (...arg) => uploadController(...arg);

//// Mongo aggregation for database fetching
exports._M_.aggregateFetch = (...arg) => fetchController(...arg);

//// passport: populating `req.user`
exports._M_.usePassport = [exports._M_.doNotCrawled, passport.initialize(), passport.session()];

//// authentication
exports._M_.isSignedIn = [...exports._M_.usePassport, (req, res, next) => {
  if (!(req.isAuthenticated() && req.session.user)) throw new _U_.error.ClientError(20003);
  return next();
}];

//// authorization
exports._M_.isAuthorized = [...exports._M_.isSignedIn, async (req, res, next) => {
  const [field, val] = req.params.canonical !== undefined
    ? ['canonical', req.params.canonical]
    : ['_id', _U_.string.readMongoId(req.url)];
  if (await postsModel.count({ [field]: val, 'author._id': req.user._id }) !== 1) throw new _U_.error.ClientError(20001);// tofix: find the post first then decide to give or not
  return next();
}];

//// validation: password formats
exports._M_.passwordValidation = (req, res, next) => {
  if (!req.body.password.new || !req.body.password.confirmed) {
    throw new _U_.error.ClientError(10001);
  } else if (req.body.password.new.toString() !== req.body.password.confirmed.toString()) {
    throw new _U_.error.ClientError(10002);
  } else if (req.body.password.old && (req.body.password.old.toString() === req.body.password.new.toString())) {
    throw new _U_.error.ClientError(10003);
  }
  return next();
};
