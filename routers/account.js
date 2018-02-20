const { RouterHub } = require('../controllers/routers/driver');
const { account } = require('../controllers/routers/rules/account');
const { AccountError } = require('../controllers/errors');



// ==============================
//  ROUTER HUB
// ==============================
const UserRouter = new RouterHub([{
    route:          '/signup',
    controller:     account.signup,
    settings:       { title: 'Sign Up' },
}, {
    route:          '/signin',
    controller:     account.signin,
    settings:       { title: 'Sign In' },
}, {
    route:          '/signout',
    controller:     account.signout,
}]);


// pre-used middleware
UserRouter.pre(require('../controllers/middleware/plugins')._md.usePassport);
UserRouter.post(function (err, req, res, next) {
    throw new AccountError(err);
});



// router exports
module.exports = UserRouter.run();
