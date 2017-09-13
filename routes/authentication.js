var express                 = require('express'),
    router                  = express.Router(),
    passport                = require('passport');



// ==============================
//  MODELS
// ==============================
var UserModel               = require('../models/user');



// ==============================
//  ROUTE RULES
// ==============================
// sign-up
router.get('/signup', function (req, res) {
    res.render('console/signup');
});


// sign-up registration
router.post('/signup', function (req, res) {
    UserModel.register(new UserModel({username: req.body.username}), req.body.password, function (err, registeredUser) {
        // failed in registration
        if (err) {
            return res.redirect('/signup');     // >>> will highlight errors with qualified inputs remained
        }
        // passed responses
        passport.authenticate('local')(req, res, function () {
            console.log(registeredUser);
            res.redirect('/console/dashboard');
        });
    });
});


// sign-in
router.get('/signin', function (req, res) {
    res.render('console/signin');
});


// sign-in authentication
router.post('/signin', function(req, res) {
    passport.authenticate('local', function(err, AuthUser) {
        if (err) {
            return res.send(err);   // >>> will hide from user
        }
        if (!AuthUser) {
            // ('info' argument can be set)
            req.flash('error', 'Wrong username or password!');
            return res.redirect('/signin');
        }
        req.logIn(AuthUser, function(err) {
            if (err) {
                return res.send(err);   // >>> will hide from user
            }
            res.redirect(req.session.returnTo || '/console/dashboard');
            // destroy the session variable obtained in 'isSignedIn' config
            delete req.session.returnTo;
        });
    })(req, res);
});


// sign-out
router.get('/signout', function (req, res) {
    req.logout();
    res.redirect('back');
});



// route exports
module.exports  = router;
