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
        UserModel.register(new UserModel(req.body), req.body.password, (err, registeredUser) => {
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
    .get((req, res) => {
        if (req.isAuthenticated()) return res.redirect('/console');
        res.render('authentication/signin');
    })
    .post((req, res) => { // tofix: drier codes needed
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
                res.redirect(req.session.returnTo || '/console/dashboard');
                return delete req.session.returnTo;
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
