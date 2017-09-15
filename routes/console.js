var express                 = require('express'),
    router                  = express.Router(),
    passport                = require('passport');



// ==============================
//  MIDDLEWARE
// ==============================
var gate                    = require('../config/middleware');



// ==============================
//  ROUTE RULES
// ==============================
router.get('/dashboard', gate.isSignedIn, function (req, res) {
    res.render('./console/dashboard');
});


// route exports
module.exports  = router;
