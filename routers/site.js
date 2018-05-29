const { Device } = require('../controllers/engines/router');
const { site } = require('../controllers/routers/');


// device
const siteRouter = new Device([
  {
    route: '/configs',
    controller: site.configs,
    permission: {
      change: ['admin'],
    },
    setting: {
      title: 'Website Settings',
      template: './__root__/site/configs',
    },
  },
  {
    route: '/upload',
    controller: site.upload,
    setting: {
      title: 'Media Uploader',
      template: './__root__/site/upload',
    },
  },
  {
    route: '/stack/:collection',
    controller: site.stack,
    setting: {
      title: 'Stack',
      template: './__root__/site/stack/:collection',
      renderer: Device.renderer.VIEW_STACK,
      servingAPI: true,
    },
  },
  {
    route: '/',
    controller: site.root,
    setting: {
      title: 'Dashboard',
      template: './__root__/',
    },
  },
]);


// settings
siteRouter.setting = { title: 'Control', cache: false };
siteRouter.permission = {
  access: ['editor'],
  change: ['editor'],
};

// exports
module.exports = siteRouter;
