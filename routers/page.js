const { Device } = require('../controllers/engine/router');
const search = require('../controllers/middleware/search');



// ==============================
//  ROUTER HUB
// ==============================
const PageRouter = new Device([{
    route:          '/',
    controller:     (req, res) => res.render('./theme'),
}, {
    route:          '/search/:search',
    controller:     search.find(),
    settings:       { crawler: false, template: './theme/post/search' },
}]);



// router exports
module.exports = PageRouter.run();
