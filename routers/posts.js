const { Device } = require('../controllers/engines/router');
const { editor, posts } = require('../controllers/routers/posts');



// ==============================
//  ROUTER HUB
// ==============================
const PostRouter = new Device([{
    route:          ['/edit', '/edit/new'],
    controller:     editor.post,
    settings:       { title: 'New post', template: './__root__/editor', authenticated: true },
}, {
    route:          /^\/edit\/([a-f\d]{24})(?:\?.*|\/)?$/i,
    alias:          '/edit/:canonical',
    controller:     editor.edit,
    settings:       { title: 'Edit post', template: './__root__/editor', authorized: true },
}, {
    route:          /^\/(?![a-f\d]{24})(.+)$/i,
    alias:          '/:_id',
    controller:     posts.show,
    settings:       { template: './theme/posts/posts' },
}, {
    route:          '/',
    controller:     posts.list,
    settings:       { template: './theme/posts/index' },
}]);



// router exports
module.exports = PostRouter.run();
