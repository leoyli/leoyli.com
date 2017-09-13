var express                 = require('express'),
    router                  = express.Router(),
    passport                = require('passport');



// ==============================
//  MIDDLEWARE
// ==============================
var middleware              = require('../middleware');



// ==============================
//  ROUTE RULES
// ==============================
router.get('/dashboard', middleware.isLoggedIn, function (req, res) {
    res.render('./console/dashboard');
});


// route exports
module.exports  = router;
