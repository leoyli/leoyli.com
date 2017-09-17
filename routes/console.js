var express                 = require('express'),
    router                  = express.Router(),
    passport                = require('passport');



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
router.get('/setting', function (req, res) {
    res.render('./console/setting');
});


// user profile
router.get('/profile', function (req, res) {
    res.render('./console/profile');
});


// content manager
router.get('/content', function (req, res) {
    res.render('./console/content');
});


// media manager
router.get('/media', function (req, res) {
    res.render('./console/media');
});



// route exports
module.exports  = router;
