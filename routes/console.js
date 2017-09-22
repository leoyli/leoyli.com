const
    express                 = require('express'),
    router                  = express.Router();



// ==============================
//  MODELS
// ==============================
const UserModel             = require('../models/user');
const _siteConfig           = require('../models/_siteConfig');



// ==============================
//  FUNCTIONS
// ==============================
// middleware
const gate                  = require('../config/middleware');
router.all('*', gate.isSignedIn);

// busboy configured image uploader
const busboyImgUploader     = require('../config/busboy');



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


// (uploader)  // todo: to be integrated in profile and media manager
router
    .route('/upload') // todo: redirect back to media manager
    .get(function (req, res) {
        res.render('./console/upload');
    })
    .post(function (req, res) { // todo: will be responsible for all media uploading event and redirect user back
        busboyImgUploader(req, res, {fileSize: 3*1048576, files: 2});
    });



// route exports
module.exports  = router;

// todo - new features lists:
// 1. (Profile) User profile picture upload (ongoing)
//              Password change
// 2. (content) Content manager
//              Content export in JSON
// 3. (media)   Media manager
//              Media uploader
// 4. (notice)  Notification
// 5. (setting) Database backup
