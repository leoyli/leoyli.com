var express                 = require('express'),
    router                  = express.Router(),
    passport                = require('passport');



// ==============================
//  MODELS
// ==============================
var UserModel               = require('../models/user'),
    _siteConfig             = require('../models/_siteConfig');



// ==============================
//  MIDDLEWARE
// ==============================
var gate                    = require('../config/middleware');
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
        res.send('WE ARE CURRENTLY NOT ALLOW SETTING FILE TO BE DELETED OR CREATED.');
    });


// user profile
router
    .route('/profile')
    .get(function (req, res) {
        res.render('./console/profile');
    })
    .put(function (req, res) { // todo: change password
        UserModel.update({_id: req.user._id}, {$set: req.body.userProfile}, res.redirect('back'));
    })
    .all(function (req, res) {
        res.send('WE ARE CURRENTLY NOT ALLOW USER DATA TO BE DELETED OR ADDED.');
    });



// route exports
module.exports  = router;
