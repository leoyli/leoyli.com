const { _M_: { usePassport } } = require('../controllers/modules/');
const { Device } = require('../engines/router');
const { init } = require('../controllers/routers/');


// device
const initRouter = new Device([
  {
    route: '/',
    controller: init,
    permission: {
      access: ['public'],
      change: ['public'],
    },
    setting: {
      servingAPI: false,
      template: './__root__/init',
      title: { tag: 'App Initializer', extend: false },
    },
  },
]);


// exports
initRouter.hook('pre', usePassport);
initRouter.setting.init = true;
module.exports = initRouter;
