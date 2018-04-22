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
  setting:        { template: './theme/posts/search', crawler: false, handler: Device.handler.VIEW_POSTS_MULTIPLE },
}]);



// exports
module.exports = PageRouter.run();
