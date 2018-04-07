const { Device } = require('../controllers/engines/router');
const pages = require('../controllers/routers/pages');



// ==============================
//  ROUTER HUB
// ==============================
const PageRouter = new Device([{
  route:          '/',
  controller:     pages.landing,
  setting:        { template: './theme/index' },
}, {
  route:          '/search/:search',
  controller:     pages.search,
  setting:        { template: './theme/posts/search', handler: 'posts.multiple', crawler: false },
}]);



// router exports
module.exports = PageRouter.run();
