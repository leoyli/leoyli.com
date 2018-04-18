const { _M_ } = require('../middleware/');
const { usersModel } = require('../../models/');



// controllers
module.exports = home = {};

home.main = {
  GET: function home_main_GET(req, res, next) {
    return next();
  },
};

home.profile = {
  GET: function home_profile_GET(req, res, next) {
    res.locals.$$VIEW.user = req.user._doc;
    return next();
  },
  PATCH: async function home_profile_PATCH(req, res) {
    const raw = { info: req.body.profile.info, nickname: req.body.profile.nickname };
    if (raw.info && raw.info.birthday) raw.info.birthday = new Date(raw.info.birthday);
    await usersModel.update({ _id: req.user._id }, { $set: { ...raw, _nickname: req.user.nickname }});
    req.flash('info', 'Your profile have been successfully updated!');
    return res.redirect('/home/profile');
  },
};

home.profile_editor = {
  GET: function home_profile_editor_GET(req, res, next) {
    res.locals.$$VIEW.user = req.user._doc;
    return next();
  },
};

home.security = {
  GET: function admin_security_GET(req, res, next) {
    return next();
  },
  PATCH: [_M_.passwordValidation, async function home_security_PATCH(req, res) {
    await req.user.changePassword(req.body.password.old, req.body.password.new);
    req.flash('info', 'Password have been successfully changed.');
    return res.redirect('/home/profile');
  }],
};

