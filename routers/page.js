const { RouterHub } = require('../controllers/routers/driver');
const search = require('../controllers/middleware/search');



// ==============================
//  ROUTER HUB
// ==============================
const PageRouter = new RouterHub([{
    route:          '/',
    controller:     (req, res) => res.render('./theme'),
}, {
    route:          '/search/:search',
    controller:     search.find(),
    settings:       { crawler: false, template: './theme/post/search' },
}]);



// router exports
module.exports = PageRouter.run();
