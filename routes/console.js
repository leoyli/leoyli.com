const
    express                 = require('express'),
    router                  = express.Router();



// ==============================
//  MODELS
// ==============================
const UserModel             = require('../models/user');
const MediaModel            = require('../models/media');
const _siteConfig           = require('../models/_siteConfig');



// ==============================
//  FUNCTIONS
// ==============================
// middleware
const _pre                  = require('../config/middleware');
router.all('*', _pre.isSignedIn, _pre.setPageTitle('Console'));



// ==============================
//  ROUTE RULES
// ==============================
// dashboard
router.get(/^\/(dashboard)?(\/)?$/, _pre.setPageTitle('Dashboard'), (req, res) => res.render('./console/dashboard'));


// site setting
router
    .route('/setting')
    .all(_pre.setPageTitle('Website Configurations'))
    .get((req, res) => res.render('./console/setting'))
    .patch((req, res) => {
        _siteConfig.updateSettings(req.body.siteSetting)
            .catch(err => {req.flash('error', err.toString());})
            .then(() => res.redirect('back'));
    });


// user profile
router
    .route('/profile')
    .all(_pre.setPageTitle('Profile'))
    .get((req, res) => res.render('./console/profile'))
    .patch((req, res) => {
        UserModel.update({_id: req.user._id}, {$set: req.body.userProfile})
            .catch(err => {req.flash('error', err.toString());})
            .then(() => res.redirect('back'));
    });


// account security (password changing)
router
    .route('/security')
    .all(_pre.setPageTitle('Account Settings'))
    .get((req, res) => res.render('./console/security'))
    .patch(_pre.passwordValidation, (req, res) => {
        req.user.changePassword(req.body.password.old, req.body.password.new, err => {
            if (err) req.flash('error', err.toString());
            else req.flash('info', 'Password have been successfully changed.');
            res.redirect('back');
        });
    });


// media uploader  // todo: to be integrated in profile and media manager
router
    .route('/upload') // todo: redirect back to media manager
    .all(_pre.setPageTitle('Media Uploader'))
    .get((req, res) => res.render('./console/upload'))
    .post((req, res) => { // todo: will be responsible for all media uploading event and redirect user back
        MediaModel.mediaUpload(req, res, {fileSize: 85*1048576, files: 2})
            .then(uploadedMedia => MediaModel.mediaCreateThenAssociate(uploadedMedia, req.user))
            .catch(err => {
                if (err.name === 'ValidationError') delete req.session.flash.info;
                req.flash('error', err.toString());
            })
            .then(() => res.redirect('back'));
    });



// route exports
module.exports  = router;
