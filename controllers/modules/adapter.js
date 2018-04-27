const { _U_ } = require('../utilities/');


// modules
const passport = require('passport');
const { PostsModel } = require('../../models/');
const { APIHeader } = require('./regulator');
const { responseInitializer } = require('../views/responder');
const { uploadController } = require('./upload');
const { fetchController } = require('./fetch');
const { noCrawlerHeader } = require('./regulator');


/** HTML responder **/
const responseHTMLRequest = (...arg) => responseInitializer(...arg);


/** API responder **/
const responseAPIRequest = (...arg) => APIHeader(...arg);


/** busboy for multipart form parsing **/
const parseMultipart = (...arg) => uploadController(...arg);


/** Mongo aggregation for database fetching **/
const aggregateFetch = (...arg) => fetchController(...arg);


/** passport: populating `req.user` **/
const usePassport = [noCrawlerHeader, passport.initialize(), passport.session()];


/** authentication **/
const isSignedIn = [...usePassport, function isSignedIn(req, res, next) {
  if (!(req.isAuthenticated() && req.session.user)) throw new _U_.error.ClientError(20003);
  return next();
}];


/** authorization **/
const isAuthorized = [...isSignedIn, async function isAuthorized(req, res, next) {
  const [field, val] = req.params.canonical !== undefined
    ? ['canonical', req.params.canonical]
    : ['_id', _U_.string.readMongoId(req.url)];
  if (await PostsModel.count({ [field]: val, 'author._id': req.user._id }) !== 1) throw new _U_.error.ClientError(20001);// tofix: find the post first then decide to give or not
  return next();
}];


/** validation: password formats **/
const passwordValidation = function passwordValidation(req, res, next) {
  if (!req.body.password.new || !req.body.password.confirmed) {
    throw new _U_.error.ClientError(10001);
  } else if (req.body.password.new.toString() !== req.body.password.confirmed.toString()) {
    throw new _U_.error.ClientError(10002);
  } else if (req.body.password.old && (req.body.password.old.toString() === req.body.password.new.toString())) {
    throw new _U_.error.ClientError(10003);
  }
  return next();
};


// exports
module.exports = {
  responseHTMLRequest,
  responseAPIRequest,
  parseMultipart,
  aggregateFetch,
  usePassport,
  isSignedIn,
  isAuthorized,
  passwordValidation,
};
