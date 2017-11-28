const RouterHub = require('../controllers/router');
const editor = require('../controllers/router/editor');
const search = require('../controllers/router/search');



// ==============================
//  FUNCTIONS
// ==============================
const _fn = require('../controllers/methods');
const { _md } = require('../controllers/middleware');
const { postModel } = require('../models');



// ==============================
//  ROUTER HUB
// ==============================
const PostRouter = new RouterHub([{
    route:          ['/editor', '/editor/new'],
    controller:     editor.post,
    settings:       { title: 'New post', authentication: true },
}, {
    route:          /^\/editor\/[a-f\d]{24}(\/)?$/,
    controller:     editor.edit,
    settings:       { title: 'post Editor', authorization: true },
}, {
    route:          '/editor/:canonical',
    controller:     _md.wrapAsync(async (req, res) => {
                        req.session.view = { post: await postModel.findOne(req.params) };
                        res.redirect(`/post/editor/${req.session.view.post._id}`);
                    }),
    settings:       { authorization: true },
}, {
    route:          /^\/[a-f\d]{24}(\/)?$/,
    controller:     _md.wrapAsync(async (req, res) => {
                        req.session.view = { post: await postModel.findById(_fn.string.readObjectID(req.url)) };
                        res.redirect(`/post/${req.session.view.post.canonical}`);
                    }),
}, {
    route:          '/:canonical',
    controller:     search.find({type: 'singular'}),
    settings:       { template: './theme/post/post' },
}, {
    route:          '/',
    controller:     search.find(),
    settings:       { template: './theme/post' },
}]);



// router exports
module.exports = PostRouter.activate();
