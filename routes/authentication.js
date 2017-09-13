var express                 = require('express'),
    router                  = express.Router(),
    passport                = require('passport');



// ==============================
//  MIDDLEWARE
// ==============================
var middleware              = require('../middleware');



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
        if (err) return res.redirect('/signup');
        passport.authenticate('local')(req, res, function () {  /// function (err, user) would worked???
            console.log(registeredUser);
            res.redirect(req.session.returnTo || '/console/dashboard');   /// dir-to 1) user-profile
            delete req.session.returnTo;
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
            console.log(err);
            return res.send(err);
        }
        if (!AuthUser) {
            // *** req.flash('error', 'Wrong username or password!');
            console.log('Wrong username or password!');
            return res.redirect('/signin');
        }
        req.logIn(AuthUser, function(err) {
            if (err) {
                console.log(err);
                return res.send(err);
            }
            // *** req.flash('info', 'Welcome back <strong>' + AuthUser.username + '</strong>.');
            res.redirect(req.session.returnTo || '/console/dashboard');
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
