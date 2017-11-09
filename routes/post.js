const
    express                 = require('express'),
    router                  = express.Router();



// ==============================
//  MODELS
// ==============================
const { postModel }         = require('../schema');



// ==============================
//  FUNCTIONS
// ==============================
// ancillaries
const _fn                   = require('../config/methods');

// middleware
const { _pre, _end }        = require('../config/middleware');



// ==============================
//  ROUTE RULES
// ==============================
// editor - new
router
    .route(['/editor', '/editor/new'])
    .all(_pre.isSignedIn, _pre.prependTitleTag('New Post'))
    .get(_end.next.postRender('./console/editor', {}))
    .post(_end.wrapAsync(async (req, res) => {
        req.body.post.content = _fn.string.escapeInHTML(req.body.post.content);
        await postModel.postsCreateThenAssociate(req.body.post, req.user);
        req.flash('info', 'Post have been successfully posted!');
        res.redirect('/post');
    }));


// editor - existed
router
    .route(/^\/editor\/[a-f\d]{24}(\/)?$/)
    .all(_pre.isAuthorized, _pre.prependTitleTag('Post Editor'))
    .get(_end.wrapAsync(async (req, res) => {
        res.locals._render = (req.session.post && req.session.post._id === _fn.string.readObjectID(req.url))
            ? {view: './console/editor', post: req.session.post}
            : {view: './console/editor', post: await postModel.findById(_fn.string.readObjectID(req.url))};
        if (req.session.post) delete req.session.post;
        _end.next.postRender()(req, res);
    }))
    .patch(_end.wrapAsync(async (req, res) => {
        req.body.post.content = _fn.string.escapeInHTML(req.body.post.content);
        const doc = await postModel.findByIdAndUpdate(_fn.string.readObjectID(req.url), req.body.post, { new: true });
        req.flash('info', 'Post have been successfully updated!');
        res.redirect(`/post/${doc.canonicalKey}`);
    }))
    .delete(_end.wrapAsync(async (req, res) => { // todo: trash can || double check
        await postModel.postsDeleteThenDissociate(_fn.string.readObjectID(req.url), req.user);
        req.flash('info', 'Post have been successfully deleted!');
        res.redirect(`/post/`);
    }));

router
    .get('/editor/:KEY', _pre.isAuthorized, _end.wrapAsync(async (req, res) => {
        req.session.post = await postModel.findOne({ canonicalKey: req.params.KEY });
        if (!req.session.post) {
            delete req.session.post;
            req.flash('error', 'Nothing were found...');
            res.redirect('back');
        } else res.redirect(`/post/editor/${req.session.post._id}`);
    }));


// show
router
    .get(/^\/[a-f\d]{24}(\/)?$/, _end.wrapAsync(async (req, res) => {
        req.session.post = await postModel.findById(_fn.string.readObjectID(req.url));
        if (!req.session.post) {
            delete req.session.post;
            req.flash('error', 'Nothing were found...');
            res.redirect('back');
        } else res.redirect(`/post/${req.session.post.canonicalKey}`);
    }))
    .get('/:KEY', _end.wrapAsync(async (req, res) => {
        res.locals._render = (req.session.post && req.session.post.canonicalKey === req.params.KEY)
            ? { view: './theme/post/post', post: req.session.post }
            : { view: './theme/post/post', post: await postModel.findOne({ canonicalKey: req.params.KEY })};
        if (req.session.post) delete req.session.post;
        _end.next.postRender()(req, res);
    }))
    .get('/', _end.wrapAsync(async (req, res) => {
        res.locals._render = { view: './theme/post/index', post: (await postModel.find()).reverse() };
        _end.next.postRender()(req, res);
    }));


// error handler
router.use(_end.error.clientError);



// route exports
module.exports = router;
