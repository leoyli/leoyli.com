const { Device } = require('../controllers/engines/router');
const { _M_ } = require('../controllers/middleware/plugins');
const admin = require('../controllers/routers/admin');



// ==============================
//  ROUTE HUB
// ==============================
const DashboardRouter = new Device([{
    route:          '/',
    controller:     admin.main,
    settings:       { title: 'Dashboard', template: './__root__/' },
}, {
    route:          '/configs',
    controller:     admin.configs,
    settings:       { title: 'Website Configurations', template: './__root__/admin/configs' },
}, {
    route:          '/upload',
    controller:     admin.upload,
    settings:       { title: 'Media Uploader', template: './__root__/admin/upload' },
}]);


// pre-used middleware
DashboardRouter.pre([_M_.isSignedIn, _M_.setTitleTag('Settings')]);



// router exports
module.exports = DashboardRouter.run();
