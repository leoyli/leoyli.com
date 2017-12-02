const RouterHub = require('../controllers/router');
const { _md } = require('../controllers/modules/core');
const dashboard = require('../controllers/router/dashboard');



// ==============================
//  ROUTE HUB
// ==============================
const DashboardRouter = new RouterHub([{
    route:          '/',
    controller:     dashboard.main,
    settings:       { title: 'Dashboard' },
}, {
    route:          '/setting',
    controller:     dashboard.setting,
    settings:       { title: 'Website Configurations' },
}, {
    route:          '/profile',
    controller:     dashboard.profile,
    settings:       { title: 'Profile' },
}, {
    route:          '/security',
    controller:     dashboard.security,
    settings:       { title: 'Account Settings' },
}, {
    route:          '/upload',
    controller:     dashboard.upload,
    settings:       { title: 'Media Uploader' },
}]);


// pre-used middleware
DashboardRouter.use(_md.isSignedIn);
DashboardRouter.use(_md.setTitleTag('Console'));



// router exports
module.exports = DashboardRouter.activate();
