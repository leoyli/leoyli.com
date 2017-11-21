const
    express                 = require('express'),
    router                  = express.Router();



// ==============================
//  MODELS
// ==============================
const { postModel }         = require('../models');



// ==============================
//  FUNCTIONS
// ==============================
// ancillaries
const _fn                   = require('../configurations/methods');

// middleware
const { _pre, _end }        = require('../configurations/middleware');

// controller
const {search} = require('../controllers/search');


// ==============================
//  ROUTE RULES
// ==============================
// editor - new
router
    .route(['/editor', '/editor/new'])
    .all(_pre.isSignedIn, _pre.prependTitleTag('New Post'))
    .get(_end.next.postRender('./console/editor', {}))
    .post(_end.wrapAsync(async (req, res) => {
        await postModel.postsCreateThenAssociate(req.body.post, req.user);
        req.flash('info', 'Post have been successfully posted!');
        res.redirect('/post');
    }));


// editor - existed
router
    .route(/^\/editor\/[a-f\d]{24}(\/)?$/)
    .all(_pre.isAuthorized, _pre.prependTitleTag('Post Editor'))
    .get((req, res) => {
        _end.next.postRender('./console/editor', postModel.findById(_fn.string.readObjectID(req.url)))(req, res);
    })
    .patch(_end.wrapAsync(async (req, res) => {
        const doc = await postModel.findByIdAndUpdate(_fn.string.readObjectID(req.url), req.body.post, { new: true });
        req.flash('info', 'Post have been successfully updated!');
        res.redirect(`/post/${doc.canonical}`);
    }))
    .delete(_end.wrapAsync(async (req, res) => { // todo: trash can || double check
        await postModel.postsDeleteThenDissociate(_fn.string.readObjectID(req.url), req.user);
        req.flash('info', 'Post have been successfully deleted!');
        res.redirect(`/post/`);
    }));

router
    .get('/editor/:KEY', _pre.isAuthorized, _end.wrapAsync(async (req, res) => {
        req.session.view = {post: await postModel.findOne({ canonical: req.params.KEY })};
        res.redirect(`/post/editor/${req.session.view.post._id}`);
    }));


// show
router
    .get(/^\/[a-f\d]{24}(\/)?$/, _end.wrapAsync(async (req, res) => {
        req.session.view = { post: await postModel.findById(_fn.string.readObjectID(req.url)) };
        res.redirect(`/post/${req.session.view.post.canonical}`);
    }))
    .get('/:canonical', search.find({type: 'singular'}), _end.next.postRender('./theme/post/post'))
    .get('/', search.find({num: 10}), _end.next.postRender('./theme/post/index'));


// error handler
router.use(_end.error.clientError);



// route exports
module.exports = router;
