const { _M_ } = require('../modules');


// controllers
const auth = {};

auth.signin = {
  POST: [_M_.JWTAuthentication, function auth_signin_POST(req, res, next) {
    res.locals.data = { accessToken: req.session.accessToken };
    return next();
  }],
};


// exports
module.exports = { auth };

Object.defineProperty(module.exports, Symbol.for('__TEST__'), {
  value: {
    ...module.exports,
  },
});
