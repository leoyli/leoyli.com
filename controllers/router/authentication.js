const { _md } = require('../middleware');
const authentication = {
    signup: {
        get: (req, res) => {
            if (req.isAuthenticated()) return res.redirect('/console/dashboard');
            res.render('./console/account/signup')
        },
        post: [_md.passwordValidation, async (req, res) => {
            const { userModel } = require('../../models');
            const newUser = await userModel.register(new userModel(req.body), req.body.password.new);
            req.logIn(newUser, err => {
                if (err) throw err;
                req.flash('info', `Welcome new user: ${req.body.username}`);
                res.redirect('/console');
            });
        }],
    },
    signin: {
        get: (req, res) => {
            if (req.isAuthenticated()) return res.redirect('/console');
            res.render('./console/account/signin');
        },
        post: (req, res, next) => {
            if (req.isAuthenticated()) return res.redirect('/console');
            const passport = require('passport');
            passport.authenticate('local', (err, authUser) => {
                // exception
                if (err) return next(err);
                if (!authUser) return next(new Error('Wrong email/username or password!'));

                // normal
                req.logIn(authUser, err => {
                    if (err) return next(err);

                    // session
                    req.session.cookie.expires = req.body.isPersisted
                        ? new Date(Date.now() + 14 * 24 * 3600 * 1000)
                        : false;
                    req.session.user = {
                        _id: authUser._id,
                        picture: authUser.picture,
                        nickname: authUser.nickname,
                    };

                    // client response
                    req.flash('info', `Welcome back ${authUser.username}`);
                    const returnTo = req.session.returnTo;
                    delete req.session.returnTo;
                    return res.redirect(returnTo || '/console/dashboard');
                });
            })(req, res);
        },
    },
    signout: {
        get: (req, res) => {
            if (req.isAuthenticated()) {
                req.logout();
                req.flash('pass', true);
                req.flash('info', 'See you next time!');
            }
            delete req.session.user;
            res.redirect('back');
        },
    },
};



// controller export
module.exports = authentication;
