const passport = require('passport');
const { _M_ } = require('../modules/');
const { UsersModel } = require('../../models/');
const { ClientException } = require('../utilities/')._U_.error;


// controllers
const auth = {};

auth.signup = {
  GET: function account_signup_GET(req, res, next) {
    if (req.isAuthenticated()) return res.redirect('/home');
    return next();
  },
  POST: [_M_.isValidPasswordReset, async function account_signup_POST(req, res) {
    const newUser = await UsersModel.register(new UsersModel(req.body), req.body.password.new);
    req.logIn(newUser, err => {
      if (err) throw err;
      req.flash('info', `Welcome new user: ${req.body.username}`);
      return res.redirect('/home');
    });
  }],
};


auth.signin = {
  GET: function account_signin_GET(req, res, next) {
    if (req.isAuthenticated()) return res.redirect('/home');
    if (res.locals.$$VIEW.flash.action.includes('retry')) req.flash('action', 'retry');                                 // note: // preserve `returnTo` if client not visit any other pages
    return next();
  },
  POST: function account_signin_POST(req, res, next) {
    if (req.isAuthenticated()) return res.redirect('/home');
    return passport.authenticate('local', (authErr, authUser) => {
      if (authErr) return next(authErr);
      if (!authUser) return next(new ClientException(20002));
      return req.logIn(authUser, loginErr => {
        if (loginErr) return next(loginErr);
        authUser.updateLastTimeLog('signIn');
        req.session.cookie.expires = new Date(req.body.isPersisted ? (14 * 24 * 3600000) + Date.now() : Date.now());
        req.session.user = { _id: authUser._id, picture: authUser.picture, nickname: authUser.nickname };
        req.flash('info', `Welcome back ${authUser.nickname}`);
        return res.redirect(req.session.returnTo || '/home');
      });
    })(req, res, next);
  },
};


auth.signout = {
  GET: function account_signout_GET(req, res) {
    if (req.isAuthenticated()) {
      req.logout();
      req.flash('info', 'See you next time!');
      delete req.session.user;
    }
    return res.redirect('back');
  },
};


// exports
module.exports = { auth };

Object.defineProperty(module.exports, Symbol.for('__TEST__'), {
  value: {
    ...module.exports,
  },
});
