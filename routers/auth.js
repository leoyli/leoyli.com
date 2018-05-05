/* eslint-disable key-spacing */
const { usePassport } = require('../controllers/modules/')._M_;
const { ClientException } = require('../controllers/utilities/')._U_.error;
const { Device } = require('../controllers/engines/router');
const auth = require('../controllers/routers/auth');


// device
const authRouter = new Device([
  {
    route:        '/signup',
    controller:   auth.signup,
    setting:      { title: 'Sign Up', template: './__root__/account/signup' },
  },
  {
    route:        '/signin',
    controller:   auth.signin,
    setting:      { title: 'Sign In', template: './__root__/account/signin' },
  },
  {
    route:        '/signout',
    controller:   auth.signout,
  },
]);


// settings
authRouter.hook('pre', usePassport);
authRouter.hook('post', (err, req, res, next) => {
  return next(new ClientException(err));
});


// exports
module.exports = authRouter;
