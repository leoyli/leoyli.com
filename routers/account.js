/* eslint-disable key-spacing */
const { usePassport } = require('../controllers/modules/')._M_;
const { ClientException } = require('../controllers/utilities/')._U_.error;
const { Device } = require('../controllers/engines/router');
const account = require('../controllers/routers/account');


// device
const userRouter = new Device([
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
userRouter.hook('pre', usePassport);
userRouter.hook('post', (err, req, res, next) => {
  return next(new ClientException(err));
});


// exports
module.exports = userRouter.run();
