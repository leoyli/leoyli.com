const
    routerHub = require('../controllers/router');



// ==============================
//  ROUTER HUB
// ==============================
const PageRouter = new routerHub.Rule([{
    path:           '/',
    method:         'get',
    controller:     [(req, res) => res.render('./theme')],
    template:       null,
}, {
    path:           '/search/:search',
    method:         'get',
    controller:     require('../controllers/search').search.find(),
    template:       './theme/search',
    option:         { crawl: false },
}]);



// route exports
module.exports = PageRouter;
