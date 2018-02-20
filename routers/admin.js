const { RouterHub } = require('../controllers/routers/driver');
const { _md } = require('../controllers/middleware/plugins');
const home = require('../controllers/routers/rules/admin');



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
DashboardRouter.pre([_md.isSignedIn, _md.setTitleTag('Account')]);



// router exports
module.exports = DashboardRouter.run();
