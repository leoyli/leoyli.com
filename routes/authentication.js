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
const { _pre, _end }        = require('../config/middleware');



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
    .post(_pre.passwordValidation, _end.wrapAsync(async (req, res) => {
        const newUser = await UserModel.register(new UserModel(req.body), req.body.password.new);
        req.logIn(newUser, err => {
            if (err) throw err;
            req.flash('info', `Welcome new user: ${req.body.username}`);
            res.redirect('/console');
        });
    }));


// sign-in
router
    .route('/signin')
    .all(_pre.prependTitleTag('Sign In'))
    .get((req, res) => {
        if (req.isAuthenticated()) return res.redirect('/console');
        res.render('./console/account/signin');
    })
    .post((req, res, next) => passport.authenticate('local', (err, authUser) => {   // note: async/await will handle error; otherwise handle by calling next();
        // exception
        if (err) return next(err);
        if (!authUser) return next(new Error('Wrong email/username or password!'));

        // normal
        req.logIn(authUser, err => {
            if (err) return next(err);
            const returnTo = req.session.returnTo;
            delete req.session.returnTo;
            req.flash('info', `Welcome back ${authUser.username}`);
            return res.redirect(returnTo || '/console/dashboard');
        });
    })(req, res));


// sign-out
router
    .route('/signout')
    .get((req, res) => {
        if (req.isAuthenticated()) {
            req.logout();
            req.session.justSignedOut = true;
            req.flash('info', 'See you next time!');
        }
        res.redirect('back');
    });


// error handler
router.use(_end.error.clientError);



// route exports
module.exports  = router;
