module.exports = home = {};



// ==============================
//  DEPENDENCIES
// ==============================
const { _md } = require('../../middleware/plugins');
const { settingModel, mediaModel, userModel } = require('../../../models/index');



// ==============================
//  CONTROLLERS
// ==============================
home.main = {
    get: (req, res) => res.render('./root/'),
};

home.setting = {
    get: (req, res) => res.render('./root/setting'),
    patch: async (req, res) => {
        await settingModel.updateSettings(req.body.siteSetting);
        return res.redirect('back');
    },
};

home.profile = {
    get: (req, res) => res.render('./root/account/profile'),
    patch: async (req, res) => {
        await userModel.update({ _id: req.user._id }, { $set: req.body.profile });
        return res.redirect('back');
    },
};

home.security = {
    get: (req, res) => res.render('./root/account/security'),
    patch: [_md.passwordValidation, async (req, res) => {
        await req.user.changePassword(req.body.password.old, req.body.password.new);
        req.flash('info', 'Password have been successfully changed.');
        return res.redirect('back');
    }],
};

home.upload = {   // todo: to be integrated in profile and media manager
    get: (req, res) => res.render('./root/upload'),
    post: [_md.hireBusboy({ fileSize: 25*1048576 }), async (req, res) => {
        if (req.body.busboySlip.mes.length > 0) req.body.busboySlip.mes.forEach(mes => req.flash('error', mes));
        if (req.body.busboySlip.raw.length > 0) {
            const docs = await mediaModel.mediaCreateThenAssociate(req.body.busboySlip.raw, req.user);
            if (docs.length > 0) req.flash('info', `${docs.length} file(s) successfully uploaded!`);
        }
        return res.redirect('back');
    }],
};
