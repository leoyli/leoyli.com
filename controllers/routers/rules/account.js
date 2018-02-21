module.exports = exports = { account: {} };



// ==============================
//  DEPENDENCIES
// ==============================
const { _md } = require('../../middleware/plugins');
const { userModel } = require('../../../models/index');
const { AccountError } = require('../../errors');



// ==============================
//  CONTROLLERS
// ==============================
exports.account.signup = {
    get: (req, res) => {
        if (req.isAuthenticated()) return res.redirect('/home');
        return res.render('./root/account/signup');
    },
    post: [_md.passwordValidation, async (req, res) => {
        const newUser = await userModel.register(new userModel(req.body), req.body.password.new);       // tofix: handle MongoError - BulkWriteError //E11000 duplicate key error collection: leoyli-dev.users index: username_1 dup key: { : "leo" }
        req.logIn(newUser, err => {
            if (err) throw err;
            req.flash('info', `Welcome new user: ${req.body.username}`);
            return res.redirect('/home');
        });
    }],
};

exports.account.signin = {
    get: (req, res) => {
        if (req.isAuthenticated()) return res.redirect('/home');
        return res.render('./root/account/signin');
    },
    post: (req, res, next) => {
        if (req.isAuthenticated()) return res.redirect('/home');
        return require('passport').authenticate('local', (err, authUser) => {
            if (err) return next(err);
            if (!authUser) return next(new AccountError('Wrong email/username or password!'));
            return req.logIn(authUser, err => {
                if (err) return next(err);
                req.session.cookie.expires = req.body.isPersisted ? new Date(Date.now() + 14 * 24 * 3600000) : false;
                req.session.user = { _id: authUser._id, picture: authUser.picture, nickname: authUser.nickname };
                req.flash('info', `Welcome back ${authUser.username}`);
                const returnTo = req.session.returnTo;
                delete req.session.returnTo;
                return res.redirect(returnTo || '/home');
            });
        })(req, res);
    },
};

exports.account.signout = {
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
