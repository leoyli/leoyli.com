const passport = require('passport');
const { _U_ } = require('../utilities/');
const { PostsModel } = require('../../models/');
const { noCrawlerHeader } = require('./header');


/**
 * (plugin) use passport to populate `req.user`
 */
const usePassport = [noCrawlerHeader, passport.initialize(), passport.session()];


/**
 * validate if client is authenticated
 */
const isSignedIn = [...usePassport, function isSignedIn(req, res, next) {
  if (!(req.isAuthenticated() && req.session.user)) throw new _U_.error.ClientException(20000);
  return next();
}];


/**
 * validate if client is authorized
 */
const isAuthorized = [...isSignedIn, async function isAuthorized(req, res, next) {
  const [field, val] = req.params.canonical
    ? ['canonical', req.params.canonical]
    : ['_id', _U_.string.parseMongoObjectId(req.url)];
  if (await PostsModel.count({ [field]: val, 'author._id': req.user._id }) !== 1) {                                     // tofix: find the post first then decide to give or not
    throw new _U_.error.ClientException(20001);
  }
  return next();
}];


/**
 * validate if resetting password is acceptable
 */
const isValidPasswordSyntax = (req, res, next) => {
  const { password } = req.body;
  if (password.old === '' || !password.new || !password.confirmed) throw new _U_.error.ClientException(10001);
  if (password.new !== password.confirmed) throw new _U_.error.ClientException(10002);
  if (password.new === password.old) throw new _U_.error.ClientException(10003);
  return next();
};


// exports
module.exports = {
  usePassport,
  isSignedIn,
  isAuthorized,
  isValidPasswordSyntax,
};

Object.defineProperty(module.exports, Symbol.for('__TEST__'), {
  value: {
    ...module.exports,
  },
});
