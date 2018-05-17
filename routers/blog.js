/* eslint-disable key-spacing */
const { Device } = require('../controllers/engines/router');
const { editor, blog } = require('../controllers/routers/');


// device
const blogRouter = new Device([
  {
    route:        ['/edit', '/new'],
    controller:   editor.new,
    setting:      { template: './__root__/editor', title: 'New post', authentication: true },
  },
  {
    route:        /^\/([a-f\d]{24})\/?\/edit\/?$/i,
    alias:        '/:canonical/edit',
    controller:   editor.post,
    setting:      { template: './__root__/editor', title: 'Edit post', authorization: true },
  },
  {
    route:        /^\/(?![a-f\d]{24}\/?$)([^\/]+)\/?$/i,
    alias:        '/:_id',
    controller:   blog.post,
    setting:      { template: './theme/blog/posts', renderer: Device.renderer.VIEW_POSTS_SINGLE, servingAPI: true },
  },
  {
    route:        '/',
    controller:   blog.list,
    setting:      { template: './theme/blog/', renderer: Device.renderer.VIEW_POSTS_MULTIPLE, servingAPI: true },
  },
]);


// settings
blogRouter.setting.renderer = Device.renderer.VIEW_POSTS_SINGLE;


// exports
module.exports = blogRouter;
