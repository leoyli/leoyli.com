const { Device } = require('../controllers/engine/router');
const { editor, post } = require('../controllers/routers/post');



// ==============================
//  ROUTER HUB
// ==============================
const PostRouter = new Device([{
    route:          ['/editor', '/editor/new'],
    controller:     editor.post,
    settings:       { title: 'New post', template: './root/editor', authenticated: true },
}, {
    route:          /^\/editor\/([a-f\d]{24})(?:\?.*|\/)?$/i,
    alias:          '/editor/:canonical',
    controller:     editor.edit,
    settings:       { title: 'post Editor', template: './root/editor', authorized: true },
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
