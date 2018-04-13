module.exports = exports = { account: {} };



// modules
const { ClientError } = require('../utilities/')._U_.error;
const { _M_ } = require('../middleware/plugins');
const { usersModel } = require('../../models/');



// controllers
exports.account.signup = {
  GET: (req, res, next) => {
    if (req.isAuthenticated() && req.session.user) return res.redirect('/home');
    return next();
  },
  POST: [_M_.passwordValidation, async (req, res) => {
    const newUser = await usersModel.register(new usersModel(req.body), req.body.password.new);
    req.logIn(newUser, err => {
      if (err) throw err;
      req.flash('info', `Welcome new user: ${req.body.username}`);
      return res.redirect('/home');
    });
  }],
};

exports.account.signin = {
  GET: (req, res, next) => {
    if (res.locals.$$VIEW.flash.action[0] === 'retry' ) req.flash('action', 'retry');
    if (req.isAuthenticated() && req.session.user) return res.redirect('/home');
    return next();
  },
  POST: (req, res, next) => {
    if (req.isAuthenticated() && req.session.user) return res.redirect('/home');
    return require('passport').authenticate('local', (err, authUser) => {
      if (err) return next(err);  // todo: throw an error
      if (!authUser) return next(new ClientError(20002));
      return req.logIn(authUser, err => {
        if (err) return next(err); // todo: throw an error
        authUser.updateLastTimeLog('signIn');
        req.session.cookie.expires = req.body.isPersisted ? new Date(Date.now() + 14 * 24 * 3600000) : false;
        req.session.user = { _id: authUser._id, picture: authUser.picture, nickname: authUser.nickname };
        req.flash('info', `Welcome back ${authUser.nickname}`);
        return res.redirect(req.session.returnTo || '/home');
      });
    })(req, res);
  },
};

exports.account.signout = {
  GET: (req, res) => {
    if (req.isAuthenticated() && req.session.user) {
      req.logout();
      req.flash('info', 'See you next time!');
      delete req.session.user;
    }
    return res.redirect('back');
  },
};
