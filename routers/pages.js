const { Device } = require('../controllers/engines/router');
const pages = require('../controllers/routers/pages');



// ==============================
//  ROUTER HUB
// ==============================
const PageRouter = new Device([{
    route:          '/',
    controller:     (req, res) => res.render('./theme/index'),
}, {
    route:          '/search/:search',
    controller:     pages.search,
    setting:        { template: './theme/posts/search', handler: 'posts', crawler: false },
}]);



// router exports
module.exports = PageRouter.run();
