const { Device } = require('../controllers/engines/router');
const admin = require('../controllers/routers/admin');



// device
const DashboardRouter = new Device([{
  route:          '/',
  controller:     admin.main,
  setting:        { title: 'Dashboard', template: './__root__/' },
}, {
  route:          '/configs',
  controller:     admin.configs,
  setting:        { title: 'Website Settings', template: './__root__/admin/configs' },
}, {
  route:          '/upload',
  controller:     admin.upload,
  setting:        { title: 'Media Uploader', template: './__root__/admin/upload' },
}, {
  route:          '/stack/:stackType',
  controller:     admin.stack,
  setting:        { title: 'Content Stack', template: './__root__/admin/stack/:stackType', handler: 'stack' },
}]);



// settings
DashboardRouter.setting = { title: 'Control', authentication: true, cache: false };



// exports
module.exports = DashboardRouter.run();
