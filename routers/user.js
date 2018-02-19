const { RouterHub } = require('../controllers/routers/driver');
const user = require('../controllers/routers/rules/user');



// ==============================
//  ROUTER HUB
// ==============================
const AuthenticationRouter = new RouterHub([{
    route:          '/signup',
    controller:     user.signup,
    settings:       { title: 'Sign Up' },
}, {
    route:          '/signin',
    controller:     user.signin,
    settings:       { title: 'Sign In' },
}, {
    route:          '/signout',
    controller:     user.signout,
}]);


// pre-used middleware
AuthenticationRouter.use(require('../controllers/middleware/plugins')._md.usePassport);



// router exports
module.exports = AuthenticationRouter.run();
