var express                 = require('express'),
    router                  = express.Router(),
    passport                = require('passport');



// ==============================
//  MIDDLEWARE
// ==============================
var middleware              = require('../config/middleware');



// ==============================
//  ROUTE RULES
// ==============================
router.get('/dashboard', middleware.isSignedIn, function (req, res) {
    res.render('./console/dashboard');
});


// route exports
module.exports  = router;
