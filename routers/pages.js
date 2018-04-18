const { Device } = require('../controllers/engines/router');
const pages = require('../controllers/routers/pages');



// device
const PageRouter = new Device([{
  route:          '/',
  controller:     pages.landing,
  setting:        { template: './theme/' },
}, {
  route:          '/search/:search',
  controller:     pages.search,
  setting:        { template: './theme/posts/search', handler: 'posts.multiple', crawler: false },
}]);



// exports
module.exports = PageRouter.run();
