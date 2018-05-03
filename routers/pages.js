/* eslint-disable key-spacing */
const { Device } = require('../controllers/engines/router');
const pages = require('../controllers/routers/pages');


// device
const pageRouter = new Device([
  {
    route:        '/',
    controller:   pages.landing,
    setting:      { template: './theme/' },
  },
  {
    route:        '/search/:search',
    controller:   pages.search,
    setting:      { template: './theme/posts/search', crawler: false, handler: Device.handler.VIEW_POSTS_MULTIPLE },
  },
]);


// exports
module.exports = pageRouter.run();
