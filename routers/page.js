const { Device } = require('../controllers/engines/router');
const { fetch } = require('../controllers/middleware/fetch');



// ==============================
//  ROUTER HUB
// ==============================
const PageRouter = new Device([{
    route:          '/',
    controller:     (req, res) => res.render('./theme'),
}, {
    route:          '/search/:search',
    controller:     (req, res, next) => fetch({ num: res.locals._site.sets.num })(req, res, next),
    setting:        { template: './theme/posts/search', handler: 'posts', crawler: false },
}]);



// router exports
module.exports = PageRouter.run();
