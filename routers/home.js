const { Device } = require('../controllers/engines/router');
const home = require('../controllers/routers/home');



// ==============================
//  ROUTE HUB
// ==============================
const DashboardRouter = new Device([{
    route:          '/',
    controller:     home.main,
    setting:        { title: 'Dashboard', template: './__root__/' },
}, {
    route:          '/profile',
    controller:     home.profile,
    setting:        { title: 'Profile', template: './__root__/home/profile/info' },
}, {
    route:          '/profile/edit',
    controller:     home.profile_editor,
    setting:        { title: 'Edit Your Profile', template: './__root__/home/profile/profile_editor' },
}, {
    route:          '/security',
    controller:     home.security,
    setting:        { title: 'Change Password', template: './__root__/home/profile/security' },
}]);


// pre-used middleware
DashboardRouter.setting = { title: 'Account', authenticated : true };



// router exports
module.exports = DashboardRouter.run();
