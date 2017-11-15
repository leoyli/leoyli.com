const
    express                 = require('express'),
    passport                = require('passport'),
    router                  = express.Router();



// ==============================
//  MODELS
// ==============================
const { userModel }         = require('../schema');



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
    .post(_pre.passwordValidation, _pre.usePassport, _end.wrapAsync(async (req, res) => {
        const newUser = await userModel.register(new userModel(req.body), req.body.password.new);
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
    .get(_pre.usePassport, (req, res) => {
        if (req.isAuthenticated()) return res.redirect('/console');
        res.render('./console/account/signin');
    })
    .patch(_pre.usePassport, (req, res, next) => {
        if (req.isAuthenticated()) return res.redirect('/console');
        passport.authenticate('local', (err, authUser) => {   // note: async/await will handle error; otherwise handle by calling next();
            // exception
            if (err) return next(err);
            if (!authUser) return next(new Error('Wrong email/username or password!'));

            // normal
            req.logIn(authUser, err => {
                if (err) return next(err);

                // session population
                req.session.cookie.expires = (req.body.isPersisted) ? new Date(Date.now() + 14 * 24 * 3600 * 1000) : false;
                req.session.user = {
                    _id: authUser._id,
                    nickname: authUser.nickname,
                    picture: authUser.picture,
                };

                // other response
                const returnTo = req.session.returnTo;
                delete req.session.returnTo;
                req.flash('info', `Welcome back ${authUser.username}`);
                return res.redirect(returnTo || '/console/dashboard');
            });
        })(req, res)
    });


// sign-out
router
    .route('/signout')
    .get(_pre.usePassport, (req, res) => {
        if (req.isAuthenticated()) {
            req.logout();
            req.flash('pass', true);
            req.flash('info', 'See you next time!');
        }
        delete req.session.user;
        res.redirect('back');
    });


// error handler
router.use(_end.error.clientError);



// route exports
module.exports  = router;
