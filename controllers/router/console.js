const { settingModel, mediaModel, userModel } = require('../../models');
const { _md } = require('../middleware');
const consoleControl = {
    dashboard: {
        get: (req, res) => res.render('./console/dashboard'),
    },
    setting: {
        get: (req, res) => res.render('./console/setting'),
        patch: _md.wrapAsync(async (req, res) => {
            await settingModel.updateSettings(req.body.siteSetting);
            res.redirect('back');
        }),
    },
    profile: {
        get: (req, res) => res.render('./console/account/profile'),
        patch: _md.wrapAsync(async (req, res) => {
            await userModel.update({ _id: req.user._id }, { $set: req.body.profile });
            res.redirect('back');
        }),
    },
    security: {
        get: (req, res) => res.render('./console/account/security'),
        patch: [_md.passwordValidation, _md.wrapAsync(async (req, res) => {
            await req.user.changePassword(req.body.password.old, req.body.password.new);
            req.flash('info', 'Password have been successfully changed.');
            res.redirect('back');
        })],
    },
    upload: {   // todo: to be integrated in profile and media manager
        get: (req, res) => res.render('./console/upload'),
        post: [_md.hireBusboy({ fileSize: 3*1048576, files: 2 }), _md.wrapAsync(async (req, res) => { // todo: will be responsible for all media uploading event and redirect user back
            if (req.body.busboySlip.notice[0]) {
                req.body.busboySlip.notice.forEach(notice => req.flash('error', notice));
                if (req.body.busboySlip.raw[0]) return res.redirect('back');
            }
            const doc = await mediaModel.mediaCreateThenAssociate(req.body.busboySlip.raw, req.user);
            if (doc.length > 0) req.flash('info', `${doc.length} file(s) successfully uploaded!`);
            res.redirect('back');
        })],
    },
};



// controller export
module.exports = consoleControl;
