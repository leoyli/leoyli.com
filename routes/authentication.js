const RouterHub = require('../controllers/router');
const authentication = require('../controllers/router/authentication');



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
AuthenticationRouter.use(require('../controllers/middleware')._md.usePassport);



// router exports
module.exports  = AuthenticationRouter.activate();
