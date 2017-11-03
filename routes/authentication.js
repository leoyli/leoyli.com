const
    express                 = require('express'),
    passport                = require('passport'),
    router                  = express.Router();



// ==============================
//  MODELS
// ==============================
const UserModel             = require('../models/user');



// ==============================
//  FUNCTIONS
// ==============================
// middleware
const {_pre}                = require('../config/middleware');



// ==============================
//  ROUTE RULES
// ==============================
// sign-up
router
    .route('/signup')
    .all(_pre.prependTitleTag('Sign Up'))
    .get((req, res) => {
        if (req.isAuthenticated()) return res.redirect('/console/dashboard');
        res.render('./console/account/signup')
    })
    .post(_pre.passwordValidation, (req, res) => {
        UserModel.register(new UserModel(req.body), req.body.password.new, (err, registeredUser) => {
            if (err) {
                if (err.code === 'MongoError') req.flash('error', 'DataExistsError: This username have already been taken.'); // todo: specific error code
                else req.flash('error', err.toString());
                return res.redirect('/signup'); // todo: highlight errors with qualified inputs remained
            }

            passport.authenticate('local')(req, res, () => {
                req.flash('info', `Welcome new user: ${req.body.username}`);
                res.redirect('/console');
            });
        });
    });


// sign-in
router
    .route('/signin')
    .all(_pre.prependTitleTag('Sign In'))
    .get((req, res) => {
        if (req.isAuthenticated()) return res.redirect('/console');
        res.render('./console/account/signin');
    })
    .post((req, res) => {
        passport.authenticate('local', async (err, authUser) => {
            if (err) req.flash('error', err.toString());
            else if (!authUser) req.flash('error', 'Wrong email/username or password!');
            else {
                await req.logIn(authUser, err => { if (err) {
                    req.flash('error', err.toString());
                    return res.redirect('/signin');
                }});

                // redirect the client and delete the temporary key
                req.flash('info', `Welcome back ${authUser.username}`);
                const returnTo = req.session.returnTo;
                delete req.session.returnTo;
                return res.redirect(returnTo || '/console/dashboard');
            }
            res.redirect('/signin');
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
