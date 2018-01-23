const RouterHub = require('../controllers/router');
const { _md } = require('../controllers/modules/core');
const home = require('../controllers/router/admin');



// ==============================
//  ROUTE HUB
// ==============================
const DashboardRouter = new RouterHub([{
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
    route:          '/security',
    controller:     home.security,
    settings:       { title: 'Account Settings' },
}, {
    route:          '/upload',
    controller:     home.upload,
    settings:       { title: 'Media Uploader' },
}]);


// pre-used middleware
DashboardRouter.use(_md.isSignedIn);
DashboardRouter.use(_md.setTitleTag('Console'));



// router exports
module.exports = DashboardRouter.run();
