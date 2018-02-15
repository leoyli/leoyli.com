const { RouterHub } = require('../controllers/routers/driver');
const { editor, post } = require('../controllers/routers/rules/post');



// ==============================
//  ROUTER HUB
// ==============================
const PostRouter = new RouterHub([{
    route:          ['/editor', '/editor/new'],
    controller:     editor.post,
    settings:       { title: 'New post', template: './home/editor', authenticated: true },
}, {
    route:          /^\/editor\/([a-f\d]{24})(?:\?.*|\/)?$/i,
    alias:          '/editor/:canonical',
    controller:     editor.edit,
    settings:       { title: 'post Editor', template: './home/editor', authorized: true },
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
