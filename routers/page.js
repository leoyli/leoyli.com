/* eslint-disable key-spacing */
const { Device } = require('../controllers/engines/router');
const { page } = require('../controllers/routers/');


// device
const pageRouter = new Device([
  {
    route:        '/search/:search',
    controller:   page.search,
    setting: {
      template:     './theme/search',
      renderer:      Device.renderer.VIEW_POSTS_MULTIPLE,
      crawler:      false,
      servingAPI:   true,
    },
  },
  {
    route:        '/:page/edit',
    controller:   page.show,
  },
  {
    route:        '/:page',
    controller:   page.edit,
    setting:      { servingAPI: true },
  },
  {
    route:        '/',
    controller:   page.root,
    setting:      { template: './theme/' },
  },
]);


// exports
module.exports = pageRouter;
