const
    express                 = require('express'),
    passport                = require('passport'),
    router                  = express.Router();



// ==============================
//  MODELS
// ==============================
const UserModel             = require('../models/user');



// ==============================
//  ROUTE RULES
// ==============================
// sign-up
router
    .route('/signup')
    .get((req, res) => {
        if (req.isAuthenticated()) return res.redirect('/console/dashboard');
        res.render('authentication/signup')
    })
    .post((req, res) => {
        UserModel.register(new UserModel({username: req.body.username}), req.body.password, (err, registeredUser) => {
            // failed in registration
            if (err) {
                req.flash('error', err.name + ' - ' + err.message);
                return res.redirect('/signup'); // todo: highlight errors with qualified inputs remained
            }

            // passed responses
            passport.authenticate('local')(req, res, () => {
                req.flash('info', 'Welcome new user: ' + req.body.username);
                res.redirect('/console');
            });
        });
    });


// sign-in
router
    .route('/signin')
    .get((req, res) => {
        if (req.isAuthenticated()) {
            return res.redirect('/console');
        } else res.render('authentication/signin');
    })
    .post((req, res) => {
        passport.authenticate('local', (err, authUser) => {
            if (err) return res.send(err.message);  // todo: error handling
            if (!authUser) {
                // option: 'info' argument can be set
                req.flash('error', 'Wrong username or password!');
                return res.redirect('/signin');
            }

            // sign-in the authenticated user
            req.logIn(authUser, err => {
                if (err) return res.send(err.message);  // todo: error handling
                req.flash('info', 'Welcome back ' + authUser.username);
                res.redirect(req.session.returnTo || '/console/dashboard');

                // drain the variable gained from 'isSignedIn'
                delete req.session.returnTo;
            });
        })(req, res);
    });


// sign-out
router
    .route('/signout')
    .get((req, res) => {
        // only authenticated user signing out
        if (req.isAuthenticated()) {
            req.logout();

            // flash a condition (catch by 'isSignedIn') for message forwarding
            req.flash(req.session.justSignedOut = true);
            req.flash('info', 'See you next time!');
        }
        res.redirect('back');
    });



// route exports
module.exports  = router;
