module.exports = dashboard = {};



// ==============================
//  FUNCTIONS
// ==============================
const { _md } = require('../modules/core');
const { userModel } = require('../../models');



// ==============================
//  CONTROLLERS
// ==============================
dashboard.signup = {
    get: (req, res) => {
        if (req.isAuthenticated()) return res.redirect('/dashboard');
        return res.render('./dashboard/account/signup');
    },
    post: [_md.passwordValidation, async (req, res) => {
        const newUser = await userModel.register(new userModel(req.body), req.body.password.new);
        req.logIn(newUser, err => {
            if (err) throw err;
            req.flash('info', `Welcome new user: ${req.body.username}`);
            return res.redirect('/dashboard');
        });
    }],
};

dashboard.signin = {
    get: (req, res) => {
        if (req.isAuthenticated()) return res.redirect('/dashboard');
        return res.render('./dashboard/account/signin');
    },
    post: (req, res, next) => {
        if (req.isAuthenticated()) return res.redirect('/dashboard');
        const passport = require('passport');
        return passport.authenticate('local', (err, authUser) => {
            if (err) return next(err);
            if (!authUser) return next(new Error('Wrong email/username or password!'));
            return req.logIn(authUser, err => {
                if (err) return next(err);
                req.session.cookie.expires = req.body.isPersisted ? new Date(Date.now() + 14 * 24 * 3600000) : false;
                req.session.user = { _id: authUser._id, picture: authUser.picture, nickname: authUser.nickname };
                req.flash('info', `Welcome back ${authUser.username}`);
                const returnTo = req.session.returnTo;
                delete req.session.returnTo;
                return res.redirect(returnTo || '/dashboard');
            });
        })(req, res);
    },
};

dashboard.signout = {
    get: (req, res) => {
        if (req.isAuthenticated()) {
            req.logout();
            req.flash('pass', true);
            req.flash('info', 'See you next time!');
        }
        delete req.session.user;
        return res.redirect('back');
    },
};
