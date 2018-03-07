const { Device } = require('../controllers/engines/router');
const { editor, post } = require('../controllers/routers/post');



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
    controller:     post.show,
    settings:       { template: './theme/post/post' },
}, {
    route:          '/',
    controller:     post.list,
    settings:       { template: './theme/post/index' },
}]);



// router exports
module.exports = PostRouter.run();
