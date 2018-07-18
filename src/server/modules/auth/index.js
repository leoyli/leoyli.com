const jwt = require('express-jwt');
const jwks = require('jwks-rsa');
const decode = require('jwt-decode');
const { _U_ } = require('../../utilities');


const JWTVerification = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 10,
    jwksUri: `https://${process.env.AUTH0_SERVER_DOMAIN}/.well-known/jwks.json`,
  }),
  audience: process.env.AUTH0_AUDIENCE,
  issuer: `https://${process.env.AUTH0_SERVER_DOMAIN}/`,
  algorithms: ['RS256'],
});


const JWTStorage = (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.split('Bearer ')[1];
  if (token && token !== req.session.accessToken) {
    req.session.user = req.user;
    req.session.accessToken = token;
    req.session.tokenExpiredAt = decode(token).exp * 1000;
    req.session.cookie.maxAge = req.session.tokenExpiredAt - Date.now();
  }
  return next();
};


const JWTAuthentication = (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.split('Bearer ')[1];
  if (token === req.session.accessToken && req.session.tokenExpiredAt > Date.now()) return next();
  return _U_.express.wrapMiddleware([JWTVerification, JWTStorage])(req, res, next);
};


// exports
module.exports = {
  JWTAuthentication,
  JWTVerification,
  JWTStorage,
};
