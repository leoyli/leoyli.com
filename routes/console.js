const RouterHub = require('../controllers/router');
const { _md } = require('../controllers/middleware');
const consoleControl = require('../controllers/router/console');



// ==============================
//  ROUTE HUB
// ==============================
const ConsoleRouter = new RouterHub([{
    route:          /^\/(dashboard)?(\/)?$/,
    controller:     consoleControl.dashboard,
    settings:       { title: 'Dashboard' },
}, {
    route:          '/setting',
    controller:     consoleControl.setting,
    settings:       { title: 'Website Configurations' },
}, {
    route:          '/profile',
    controller:     consoleControl.profile,
    settings:       { title: 'Profile' },
}, {
    route:          '/security',
    controller:     consoleControl.security,
    settings:       { title: 'Account Settings' },
}, {
    route:          '/upload',
    controller:     consoleControl.upload,
    settings:       { title: 'Media Uploader' },
}]);


// pre-used middleware
ConsoleRouter.use(_md.isSignedIn);
ConsoleRouter.use(_md.setTitleTag('Console'));



// router exports
module.exports = ConsoleRouter.activate();
