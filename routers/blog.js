const { Device } = require('../controllers/engines/router');
const { blog } = require('../controllers/routers/');


// device
const blogRouter = new Device([
  {
    route: ['/edit', '/new'],
    controller: blog.edit,
    permission: {
      access: ['editor'],                                                                                               // todo: use Device.permission.ROLE_EDITOR
      change: ['editor'],
    },
    setting: {
      method: 'GET',
      template: './__root__/editor',
      title: 'New post',
    },
  },
  {
    alias: '/:canonical/edit',
    route: /^\/([a-f\d]{24})\/?\/edit\/?$/i,
    controller: blog.edit,
    permission: {
      access: ['owner'],
      change: ['owner'],
    },
    setting: {
      template: './__root__/editor',
      title: 'Edit post',
    },
  },
  {
    alias: '/:canonical',
    route: /^\/([a-f\d]{24})\/?$/i,
    controller: blog.post,
    permission: {
      access: ['public'],
      change: ['owner'],
    },
    setting: {
      template: './theme/blog/posts',
      servingAPI: true,
    },
  },
  {
    route: '/',
    controller: blog.list,
    permission: {
      access: ['public'],
      change: ['editor'],
    },
    setting: {
      template: './theme/blog/',
      renderer: Device.renderer.VIEW_POSTS_MULTIPLE,
      servingAPI: true,
    },
  },
]);


// settings
blogRouter.setting.renderer = Device.renderer.VIEW_POSTS_SINGLE;


// exports
module.exports = blogRouter;
