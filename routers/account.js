const { usePassport } = require('../controllers/modules/')._M_;
const { ClientError } = require('../controllers/utilities/')._U_.error;
const { Device } = require('../controllers/engines/router');
const account = require('../controllers/routers/account');



// device
const UserRouter = new Device([
  {
    route:        '/signup',
    controller:   account.signup,
    setting:      { title: 'Sign Up', template: './__root__/account/signup' },
  },
  {
    route:        '/signin',
    controller:   account.signin,
    setting:      { title: 'Sign In', template: './__root__/account/signin' },
  },
  {
    route:        '/signout',
    controller:   account.signout,
  },
]);



// settings
UserRouter.hook('pre', usePassport);
UserRouter.hook('post', function errorWrapper(err, req, res, next) {
  return next(new ClientError(err));
});



// exports
module.exports = UserRouter.run();
