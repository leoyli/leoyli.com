/* eslint-disable key-spacing */
const { Device } = require('../../controllers/engines/router');
const { editor, posts: blog } = require('../../controllers/routers/blog');


// device
const postRouter = new Device([
  {
    route:        ['/edit', '/new'],
    controller:   editor.post,
    setting:      { title: 'New post', template: './__root__/editor', authentication: true },
  },
  {
    route:        /^\/([a-f\d]{24})\/?\/edit\/?$/i,
    alias:        '/:canonical/edit',
    controller:   editor.edit,
    setting:      { title: 'Edit post', template: './__root__/editor', authorization: true },
  },
  {
    route:        /^\/(?![a-f\d]{24}\/?$)([^\/]+)\/?$/i,
    alias:        '/:_id',
    controller:   blog.show,
    setting:      { template: './theme/blog/posts' },
  },
  {
    route:        '/',
    controller:   blog.list,
    setting:      { template: './theme/blog/', handler: Device.handler.VIEW_POSTS_MULTIPLE },
  },
]);


// settings
postRouter.setting.handler = Device.handler.VIEW_POSTS_SINGLE;


// exports
module.exports = postRouter.run();
