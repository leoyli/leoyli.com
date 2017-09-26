const
    express                 = require('express'),
    router                  = express.Router(),
    passport                = require('passport');



// ==============================
//  MODELS
// ==============================
const UserModel             = require('../models/user');



// ==============================
//  ROUTE RULES
// ==============================
// sign-up
router.get('/signup', function (req, res) {
    if (req.isAuthenticated()) return res.redirect('/console/dashboard');
    res.render('authentication/signup');
});


// sign-up registration
router.post('/signup', function (req, res) {
    UserModel.register(new UserModel({username: req.body.username}), req.body.password, function (err, registeredUser) {
        // failed in registration
        if (err) {
            req.flash('error', err.name + ' - ' + err.message);
            return res.redirect('/signup'); // todo: highlight errors with qualified inputs remained
        }

        // passed responses
        passport.authenticate('local')(req, res, function () {
            req.flash('info', 'Welcome new user: ' + req.body.username);
            res.redirect('/console');
        });
    });
});


// sign-in
router.get('/signin', function (req, res) {
    if (req.isAuthenticated()) {
        // pass message if an error received from the previous
        req.flash('error', String(res.locals.flashMessageError));
        return res.redirect('/console');
    }
    res.render('authentication/signin');
});


// sign-in authentication
router.post('/signin', function(req, res) {
    passport.authenticate('local', function(err, authUser) {
        if (err) return res.send(err);  // todo: error handling
        if (!authUser) {
            // option: 'info' argument can be set
            req.flash('error', 'Wrong username or password!');
            return res.redirect('/signin');
        }

        // login the authenticated user
        req.logIn(authUser, function(err) {
            if (err) return res.send(err);  // todo: error handling
            req.flash('info', 'Welcome back ' + authUser.username);
            res.redirect(req.session.returnTo || '/console/dashboard');

            // clean up variable gained from 'isSignedIn' middleware
            delete req.session.returnTo;
        });
    })(req, res);
});


// sign-out
router.get('/signout', function (req, res) {
    // only authenticated user can sign out and give a message
    if (req.isAuthenticated()) {
        req.logout();

        // pass a condition so that the flash message cna be displayed
        req.flash(req.session.justSignedOut = true);
        req.flash('info', 'See you next time!');
    }
    res.redirect('back');
});



// route exports
module.exports  = router;