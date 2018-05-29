const { _M_ } = require('../modules/');
const { UsersModel } = require('../../models/');


// controllers
const home = {};

home.profile = {
  GET: function home_profile_GET(req, res, next) {
    res.locals.$$VIEW.user = req.user.toObject();
    return next();
  },
  PATCH: async function home_profile_PATCH(req, res) {
    await UsersModel.update({ _id: req.user._id }, { $set: {
      info: req.body.profile.info, nickname: req.body.profile.nickname, _$nickname: req.user.nickname,
    } });
    req.flash('info', 'Your profile have been successfully updated!');
    return res.redirect('/home/profile');
  },
};


home.security = {
  GET: function home_security_GET(req, res, next) {
    return next();
  },
  PATCH: [_M_.isValidPasswordReset, async function home_security_PATCH(req, res) {
    await req.user.changePassword(req.body.password.old, req.body.password.new);
    req.flash('info', 'Password have been successfully changed.');
    return res.redirect('/home/profile');
  }],
};


// exports
module.exports = { home };

Object.defineProperty(module.exports, Symbol.for('__TEST__'), {
  value: {
    ...module.exports,
  },
});
