const { Device } = require('../engines/router');
const { page } = require('../controllers/routers/');


// device
const pageRouter = new Device([
  {
    route: '/search/:search',
    controller: page.search,
    setting: {
      template: './theme/search',
      renderer: Device.renderer.VIEW_POSTS_MULTIPLE,
      crawler: false,
      servingAPI: true,
    },
  },
  {
    route: '/:page/edit',
    controller: page.show,
    permission: {
      access: ['editor'],
    },
  },
  {
    route: '/:page',
    controller: page.edit,
    setting: {
      servingAPI: true,
    },
  },
  {
    route: '/',
    controller: page.root,
    setting: {
      template: './theme/',
    },
  },
]);


// settings
pageRouter.permission = {
  access: ['public'],                                                                                               // todo: use Device.permission.ROLE_EDITOR
  change: ['editor'],
};

// exports
module.exports = pageRouter;
