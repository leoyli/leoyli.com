/* eslint-disable key-spacing */
const { Device } = require('../controllers/engines/router');
const { editor, posts } = require('../controllers/routers/posts');


// device
const postRouter = new Device([
  {
    route:        ['/edit', '/edit/new'],
    controller:   editor.post,
    setting:      { title: 'New post', template: './__root__/editor', authentication: true },
  },
  {
    route:        /^\/edit\/([a-f\d]{24})(?:\?.*|\/)?$/i,
    alias:        '/edit/:canonical',
    controller:   editor.edit,
    setting:      { title: 'Edit post', template: './__root__/editor', authorization: true },
  },
  {
    route:        /^\/(?![a-f\d]{24})(.+)$/i,
    alias:        '/:_id',
    controller:   posts.show,
    setting:      { template: './theme/posts/posts' },
  },
  {
    route:        '/',
    controller:   posts.list,
    setting:      { template: './theme/posts/', handler: Device.handler.VIEW_POSTS_MULTIPLE },
  },
]);


// settings
postRouter.setting.handler = Device.handler.VIEW_POSTS_SINGLE;


// exports
module.exports = postRouter.run();
