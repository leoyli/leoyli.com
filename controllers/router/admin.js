module.exports = home = {};



// ==============================
//  FUNCTIONS
// ==============================
const { _md } = require('../modules/core');
const { settingModel, mediaModel, userModel } = require('../../models');



// ==============================
//  CONTROLLERS
// ==============================
home.main = {
    get: (req, res) => res.render('./home'),
};

home.setting = {
    get: (req, res) => res.render('./home/setting'),
    patch: async (req, res) => {
        await settingModel.updateSettings(req.body.siteSetting);
        return res.redirect('back');
    },
};

home.profile = {
    get: (req, res) => res.render('./home/account/profile'),
    patch: async (req, res) => {
        await userModel.update({ _id: req.user._id }, { $set: req.body.profile });
        return res.redirect('back');
    },
};

home.security = {
    get: (req, res) => res.render('./home/account/security'),
    patch: [_md.passwordValidation, async (req, res) => {
        await req.user.changePassword(req.body.password.old, req.body.password.new);
        req.flash('info', 'Password have been successfully changed.');
        return res.redirect('back');
    }],
};

home.upload = {   // todo: to be integrated in profile and media manager
    get: (req, res) => res.render('./home/upload'),
    post: [_md.hireBusboy({ fileSize: 3*1048576, files: 2 }), async (req, res) => { // todo: will be responsible for all media uploading event and redirect user back
        if (req.body.busboySlip.notice[0]) {
            req.body.busboySlip.notice.forEach(notice => req.flash('error', notice));
            if (req.body.busboySlip.raw[0]) return res.redirect('back');
        }
        const doc = await mediaModel.mediaCreateThenAssociate(req.body.busboySlip.raw, req.user);
        if (doc.length > 0) req.flash('info', `${doc.length} file(s) successfully uploaded!`);
        return res.redirect('back');
    }],
};
