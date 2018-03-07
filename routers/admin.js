const { Device } = require('../controllers/engines/router');
const { _M_ } = require('../controllers/middleware/plugins');
const home = require('../controllers/routers/admin');



// ==============================
//  ROUTE HUB
// ==============================
const DashboardRouter = new Device([{
    route:          '/',
    controller:     home.main,
    settings:       { title: 'Dashboard' },
}, {
    route:          '/setting',
    controller:     home.setting,
    settings:       { title: 'Website Configurations' },
}, {
    route:          '/profile',
    controller:     home.profile,
    settings:       { title: 'Profile' },
}, {
    route:          '/profile/edit',
    controller:     home.profile_editor,
    settings:       { title: 'Edit Your Profile' },
}, {
    route:          '/security',
    controller:     home.security,
    settings:       { title: 'Change Password' },
}, {
    route:          '/upload',
    controller:     home.upload,
    settings:       { title: 'Media Uploader' },
}]);


// pre-used middleware
DashboardRouter.pre([_M_.isSignedIn, _M_.setTitleTag('Account')]);



// router exports
module.exports = DashboardRouter.run();
