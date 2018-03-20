module.exports = home = {};



// ==============================
//  DEPENDENCIES
// ==============================
const { _M_ } = require('../middleware/plugins');
const { usersModel } = require('../../models/');



// ==============================
//  CONTROLLERS
// ==============================
home.main = {
    get: (req, res, next) => next(),
};

home.profile = {
    get: (req, res, next) => {
        res.locals.$$VIEW.user = req.user._doc;
        return next();
    },
    patch: async (req, res) => {
        const raw = { info: req.body.profile.info, nickname: req.body.profile.nickname };
        if (raw.info && raw.info.birthday) raw.info.birthday = new Date(raw.info.birthday);
        await usersModel.update({ _id: req.user._id }, { $set: { ...raw, _nickname: req.user.nickname }});
        req.flash('info', 'Your profile have been successfully updated!');
        return res.redirect('/home/profile');
    },
};

home.profile_editor = {
    get: (req, res, next) => {
        res.locals.$$VIEW.user = req.user._doc;
        return next();
    },
};

home.security = {
    get: (req, res, next) => next(),
    patch: [_M_.passwordValidation, async (req, res) => {
        await req.user.changePassword(req.body.password.old, req.body.password.new);
        req.flash('info', 'Password have been successfully changed.');
        return res.redirect('/home/profile');
    }],
};

