/* eslint-disable key-spacing */
const { Device } = require('../../controllers/engines/router');
const page = require('../../controllers/routers/page');


// device
const pageRouter = new Device([
  {
    route:        '/search/:search',
    controller:   page.search,
    setting:      { template: './theme/search', crawler: false, handler: Device.handler.VIEW_POSTS_MULTIPLE },
  },
  {
    route:        '/:page/edit',
    controller:   page.show,
  },
  {
    route:        '/:page',
    controller:   page.edit,
  },
  {
    route:        '/',
    controller:   page.root,
    setting:      { template: './theme/' },
  },
]);


// exports
module.exports = pageRouter.run();
