const { Device } = require('../controllers/engines/router');
const { home } = require('../controllers/routers/');
const { _M_ } = require('../controllers/modules/');


// device
const homeRouter = new Device([
  {
    route: '/profile/edit',
    controller: home.profile,
    setting: {
      method: 'GET',
      title: 'Edit Your Profile',
      template: './__root__/home/profile/profile_editor',
    },
  },
  {
    route: '/profile',
    controller: home.profile,
    setting: {
      title: 'Profile',
      template: './__root__/home/profile/info',
      servingAPI: false,
    },
  },
  {
    route: '/security',
    controller: home.security,
    setting: {
      title: 'Change Password',
      template: './__root__/home/profile/security',
      servingAPI: false,
    },
  },
  {
    route: '/',
    controller: home.profile,
    setting: {
      method: 'GET',
      title: 'Home',
      template: './__root__/home/profile/info',
      servingAPI: false,
    },
  },
]);


// settings
homeRouter.setting = { title: 'Account', cache: false };
homeRouter.hook('pre', _M_.usePassport);
homeRouter.permission = {
  access: ['owner'],
  change: ['owner'],
};

// exports
module.exports = homeRouter;
