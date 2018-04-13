const { Device } = require('../controllers/engines/router');
const { editor, posts } = require('../controllers/routers/posts');



// device
const PostRouter = new Device([{
  route:          ['/edit', '/edit/new'],
  controller:     editor.post,
  setting:        { title: 'New post', template: './__root__/editor', authenticated: true },
}, {
  route:          /^\/edit\/([a-f\d]{24})(?:\?.*|\/)?$/i,
  alias:          '/edit/:canonical',
  controller:     editor.edit,
  setting:        { title: 'Edit post', template: './__root__/editor', authorized: true },
}, {
  route:          /^\/(?![a-f\d]{24})(.+)$/i,
  alias:          '/:_id',
  controller:     posts.show,
  setting:        { template: './theme/posts/posts' },
}, {
  route:          '/',
  controller:     posts.list,
  setting:        { template: './theme/posts/index', handler: 'posts.multiple' },
}]);


// device settings
PostRouter.setting.handler('posts.singular');



// exports
module.exports = PostRouter.run();
