module.exports = home = {};



// ==============================
//  DEPENDENCIES
// ==============================
const { _M_ } = require('../middleware/plugins');
const { configModel, mediaModel, userModel } = require('../../models/');



// ==============================
//  CONTROLLERS
// ==============================
home.main = {
    get: (req, res, next) => next(),
};

home.setting = {
    get: (req, res, next) => next(),
    patch: async (req, res) => {
        await configModel.updateSettings(req.body.configs);
        return res.redirect('back');
    },
};

home.profile = {
    get: (req, res, next) => {
        res.locals._view.user = req.user._doc;
        return next();
    },
    patch: async (req, res) => {
        const raw = { info: req.body.profile.info, nickname: req.body.profile.nickname };
        if (raw.info && raw.info.birthday) raw.info.birthday = new Date(raw.info.birthday);
        await userModel.update({ _id: req.user._id }, { $set: raw });
        req.flash('info', 'Your profile have been successfully updated!');
        return res.redirect('/home/profile');
    },
};

home.profile_editor = {
    get: (req, res, next) => {
        res.locals._view.user = req.user._doc;
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

home.upload = {   // todo: to be integrated in profile and media manager
    get: (req, res, next) => next(),
    post: [_M_.hireBusboy({ fileSize: 25*1048576 }), async (req, res) => {
        if (req.body.busboySlip.mes.length > 0) req.body.busboySlip.mes.forEach(mes => req.flash('error', mes));
        if (req.body.busboySlip.raw.length > 0) {
            const docs = await mediaModel.mediaCreateThenAssociate(req.body.busboySlip.raw, req.user);  // tofix: handle ValidationError
            if (docs.length > 0) req.flash('info', `${docs.length} file(s) successfully uploaded!`);
        }
        return res.redirect('back');
    }],
};
