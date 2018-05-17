/* eslint-disable key-spacing */
const { Device } = require('../controllers/engines/router');
const { home } = require('../controllers/routers/');


// device
const homeRouter = new Device([
  {
    route:        '/profile/edit',
    controller:   home.profile_editor,
    setting:      { title: 'Edit Your Profile', template: './__root__/home/profile/profile_editor' },
  },
  {
    route:        '/profile',
    controller:   home.profile,
    setting:      { title: 'Profile', template: './__root__/home/profile/info', servingAPI: true },
  },
  {
    route:        '/security',
    controller:   home.security,
    setting:      { title: 'Change Password', template: './__root__/home/profile/security', servingAPI: true },
  },
]);


// settings
homeRouter.setting = { title: 'Account', authentication: true, cache: false };


// exports
module.exports = homeRouter;
