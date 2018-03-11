const { Device } = require('../controllers/engines/router');
const { _M_ } = require('../controllers/middleware/plugins');
const home = require('../controllers/routers/admin');



// ==============================
//  ROUTE HUB
// ==============================
const DashboardRouter = new Device([{
    route:          '/',
    controller:     home.main,
    settings:       { title: 'Dashboard', template: './__root__/' },
}, {
    route:          '/setting',
    controller:     home.setting,
    settings:       { title: 'Website Configurations', template: './__root__/setting' },
}, {
    route:          '/profile',
    controller:     home.profile,
    settings:       { title: 'Profile', template: './__root__/account/profile/info' },
}, {
    route:          '/profile/edit',
    controller:     home.profile_editor,
    settings:       { title: 'Edit Your Profile', template: './__root__/account/profile/profile_editor' },
}, {
    route:          '/security',
    controller:     home.security,
    settings:       { title: 'Change Password', template: './__root__/account/profile/security' },
}, {
    route:          '/upload',
    controller:     home.upload,
    settings:       { title: 'Media Uploader', template: './__root__/upload' },
}]);


// pre-used middleware
DashboardRouter.pre([_M_.isSignedIn, _M_.setTitleTag('Account')]);



// router exports
module.exports = DashboardRouter.run();
