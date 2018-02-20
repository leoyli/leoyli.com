const { RouterHub } = require('../controllers/routers/driver');
const { account } = require('../controllers/routers/rules/account');



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
UserRouter.use(require('../controllers/middleware/plugins')._md.usePassport);



// router exports
module.exports = UserRouter.run();
