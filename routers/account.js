const { ClientError } = require('../controllers/utilities/')._U_.error;
const { Device } = require('../controllers/engines/router');
const { account } = require('../controllers/routers/account');



// ==============================
//  ROUTER HUB
// ==============================
const UserRouter = new Device([{
    route:          '/signup',
    controller:     account.signup,
    settings:       { title: 'Sign Up', template: './__root__/account/signup' },
}, {
    route:          '/signin',
    controller:     account.signin,
    settings:       { title: 'Sign In', template: './__root__/account/signin' },
}, {
    route:          '/signout',
    controller:     account.signout,
}]);


// pre-used middleware
UserRouter.pre(require('../controllers/middleware/plugins')._M_.usePassport);
UserRouter.post((err, req, res, next) => next(new ClientError(err)));



// router exports
module.exports = UserRouter.run();
