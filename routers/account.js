const { AccountError } = require('../controllers/modules/')._$.error;
const { Device } = require('../controllers/engines/router');
const { account } = require('../controllers/routers/account');



// ==============================
//  ROUTER HUB
// ==============================
const UserRouter = new Device([{
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
UserRouter.post((err, req, res, next) => next(new AccountError(err)));



// router exports
module.exports = UserRouter.run();
