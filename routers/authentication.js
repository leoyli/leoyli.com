const { RouterHub } = require('../controllers/routers/driver');
const authentication = require('../controllers/routers/rules/authentication');



// ==============================
//  ROUTER HUB
// ==============================
const AuthenticationRouter = new RouterHub([{
    route:          '/signup',
    controller:     authentication.signup,
    settings:       { title: 'Sign Up' },
}, {
    route:          '/signin',
    controller:     authentication.signin,
    settings:       { title: 'Sign In' },
}, {
    route:          '/signout',
    controller:     authentication.signout,
}]);


// pre-used middleware
AuthenticationRouter.use(require('../controllers/middleware/modules')._md.usePassport);



// router exports
module.exports = AuthenticationRouter.run();
