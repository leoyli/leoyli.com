const passport = require('passport');
const { _U_ } = require('../utilities/');
const { PostsModel } = require('../../models/');
const { noCrawlerHeader } = require('./header');


/**
 * passport for `req.user`
 */
const usePassport = [noCrawlerHeader, passport.initialize(), passport.session()];


/**
 * authentication
 */
const isSignedIn = [...usePassport, function isSignedIn(req, res, next) {
  if (!(req.isAuthenticated() && req.session.user)) throw new _U_.error.ClientException(20003);
  return next();
}];


/**
 * authorization
 */
const isAuthorized = [...isSignedIn, async function isAuthorized(req, res, next) {
  const [field, val] = req.params.canonical !== undefined
    ? ['canonical', req.params.canonical]
    : ['_id', _U_.string.parseMongoObjectId(req.url)];
  if (await PostsModel.count({ [field]: val, 'author._id': req.user._id }) !== 1) {                                     // tofix: find the post first then decide to give or not
    throw new _U_.error.ClientException(20001);
  }
  return next();
}];


/**
 * password validation
 */
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


// exports
module.exports = {
  usePassport,
  isSignedIn,
  isAuthorized,
  passwordValidation,
};

Object.defineProperty(module.exports, Symbol.for('__TEST__'), {
  value: {
    ...module.exports,
  },
});
