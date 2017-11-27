// ==============================
//  MODELS
// ==============================
const { postModel }         = require('../models');



// ==============================
//  FUNCTIONS
// ==============================
// ancillaries
const _fn                   = require('../controllers/methods');

// middleware
const { _end }              = require('../controllers/middleware');

// controller
const { search }            = require('../controllers/search');
const editor = {
    post: {
        get: _end.next.postRender('./console/editor', {}),
        post: _end.wrapAsync(async (req, res) => {
            await postModel.postsCreateThenAssociate(req.body.post, req.user);
            req.flash('info', 'Post have been successfully posted!');
            res.redirect('/post');
        }),
    },
    edit: {
        get: (req, res) => {
            _end.next.postRender('./console/editor', postModel.findById(_fn.string.readObjectID(req.url)))(req, res);
        },
        patch: _end.wrapAsync(async (req, res) => {
            const doc = await postModel.findByIdAndUpdate(_fn.string.readObjectID(req.url), req.body.post, { new: true });
            req.flash('info', 'Post have been successfully updated!');
            res.redirect(`/post/${doc.canonical}`);
        }),
        delete: _end.wrapAsync(async (req, res) => { // todo: trash can || double check
            await postModel.postsDeleteThenDissociate(_fn.string.readObjectID(req.url), req.user);
            req.flash('info', 'Post have been successfully deleted!');
            res.redirect(`/post/`);
        }),
    }
};



// ==============================
//  ROUTER HUB
// ==============================
const PostRouter = new require('../controllers/router').Rule([{
    route:          ['/editor', '/editor/new'],
    method:         ['get', 'post'],
    controller:     editor.post,
    options:        { title: 'New Post', authentication: true },
}, {
    route:          /^\/editor\/[a-f\d]{24}(\/)?$/,
    method:         ['get', 'patch', 'delete'],
    controller:     editor.edit,
    options:        { title: 'Post Editor', authorization: true },
}, {
    route:          '/editor/:canonical',
    method:         'get',
    controller:     _end.wrapAsync(async (req, res) => {
                        req.session.view = { post: await postModel.findOne(req.params) };
                        res.redirect(`/post/editor/${req.session.view.post._id}`);
                    }),
    options:        { authorization: true },
}, {
    route:          /^\/[a-f\d]{24}(\/)?$/,
    method:         'get',
    controller:     _end.wrapAsync(async (req, res) => {
                        req.session.view = { post: await postModel.findById(_fn.string.readObjectID(req.url)) };
                        res.redirect(`/post/${req.session.view.post.canonical}`);
                    }),
}, {
    route:          '/:canonical',
    method:         'get',
    controller:     search.find({type: 'singular'}),
    template:       './theme/post/post',
}, {
    route:          '/',
    method:         'get',
    controller:     search.find(),
    template:       './theme/post/index',
}]);



// route exports
module.exports = PostRouter;
