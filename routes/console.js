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
const gate                  = require('../config/middleware');
router.all('*', gate.isSignedIn);



// ==============================
//  ROUTE RULES
// ==============================
// dashboard
router.get(/^\/(dashboard)?(\/)?$/, function (req, res) {
    res.render('./console/dashboard');
});


// site setting
router
    .route('/setting')
    .get(function (req, res) {
        res.render('./console/setting');
    })
    .put(function (req, res) {
        _siteConfig.updateSettings(req.body.siteSetting, function (err) {
            if (err) return res.send(err);
            res.redirect('back');
        });
    })
    .all(function (req, res) {
        res.redirect('/console/setting');
    });


// user profile
router
    .route('/profile')
    .get(function (req, res) {
        res.render('./console/profile');
    })
    .put(function (req, res) {
        UserModel.update({_id: req.user._id}, {$set: req.body.userProfile}, res.redirect('back'));
    })
    .all(function (req, res) {
        res.redirect('/console/profile');
    });


// account security
router
    .route('/security')
    .get(function (req, res) {
        res.render('./console/security');
    })
    .put(function (req, res) {
        if (!req.body.password.old || !req.body.password.new || !req.body.password.confirmation) {
            req.flash('error', 'PLEASE FILL ALL FIELDS.');
        } else if (req.body.password.new !== req.body.password.confirmation) {
            req.flash('error', 'PASSWORD DOES NOT MATCH THE CONFIRMATION.');
        } else if (req.body.password.old === req.body.password.new) {
            req.flash('error', 'PASSWORD CANNOT BE SET THE SAME.');
        } else {
            return req.user.changePassword(req.body.password.old, req.body.password.new, function (err) {
                if (err) req.flash('error', err);
                else req.flash('info', 'PASSWORD HAVE BEEN SUCCESSFULLY CHANGED.');
                res.redirect('back');
            });
        }
        res.redirect('back');
    });


// (uploader)  // todo: to be integrated in profile and media manager
router
    .route('/upload') // todo: redirect back to media manager
    .get(function (req, res) {
        res.render('./console/upload');
    })
    .post(function (req, res) { // todo: will be responsible for all media uploading event and redirect user back
        MediaModel.mediaUpload(req, res, {fileSize: 85*1048576, files: 2}, function (uploadedMedia) {
            MediaModel.mediaCreateAndAssociate(req, res, uploadedMedia, function (err, registeredMedia) {
                if (err) return res.send(err);  // todo: error handling
                res.writeHead(303, {Connection: 'close', Location: '/console/upload'});
                return res.end();
            });
        });
    });



// route exports
module.exports  = router;

// todo - new features lists:
// 1. (Profile) User profile picture upload (done)
//              Password change (done)
// 2. (content) Content manager
//              Content export in JSON
// 3. (media)   Media manager
//              Media uploader
// 4. (notice)  Notification
// 5. (setting) Database backup