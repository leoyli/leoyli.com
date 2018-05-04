/* eslint-disable key-spacing */
const { Device } = require('../../controllers/engines/router');
const site = require('../../controllers/routers/site');


// device
const siteRouter = new Device([
  {
    route:        '/',
    controller:   site.main,
    setting:      { title: 'Dashboard', template: './__root__/' },
  },
  {
    route:        '/configs',
    controller:   site.configs,
    setting:      { title: 'Website Settings', template: './__root__/site/configs' },
  },
  {
    route:        '/upload',
    controller:   site.upload,
    setting:      { title: 'Media Uploader', template: './__root__/site/upload' },
  },
  {
    route:        '/stack/:stackType',
    controller:   site.stack,
    setting:      { title: 'Stack', template: './__root__/site/stack/:stackType', handler: Device.handler.VIEW_STACK },
  },
]);


// settings
siteRouter.setting = { title: 'Control', authentication: true, cache: false };


// exports
module.exports = siteRouter.run();
