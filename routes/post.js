const
    express                 = require('express'),
    router                  = express.Router();



// ==============================
//  MODELS
// ==============================
const PostModel             = require('../models/post');



// ==============================
//  FUNCTIONS
// ==============================
// middleware
const _pre                  = require('../config/middleware');



// ==============================
//  ROUTE RULES
// ==============================
// editor - new
router
    .route(['/editor', '/editor/new'])
    .all(_pre.isSignedIn, _pre.prependTitleTag('New Post'))
    .get((req, res) => res.render('./console/editor', {post : new PostModel({_id: null}), page: {}}))
    .post(_pre.putPostSanitizer, (req, res) => {
        PostModel.postsCreateThenAssociate(req.body.post, req.user)
            .then(() => req.flash('info', 'Post have been successfully posted!'))
            .then(() => res.redirect('/post'))
            .catch(err => {
                req.flash('error', err.toString());
                res.redirect('back');
            });
    });


// editor - existed
router
    .route(/^\/editor\/[a-f\d]{24}(\/)?$/)
    .all(_pre.isAuthorized, _pre.prependTitleTag('Post Editor'))
    .get((req, res) => {
        if (req.session._doc && req.params.KEY === req.session.foundPost._doc.canonicalKey) {
            const foundPost = req.session.foundPost;
            delete req.session.foundPost;
            return renderWithDoc(req, res, './console/editor', foundPost);
        }
        PostModel.findById(req.url.readObjectID())
            .then(foundPost => renderWithDoc(req, res, './console/editor', foundPost))
            .catch(err => {
                req.flash('error', err.toString());
                res.redirect('back');
            });
    })
    .patch(_pre.putPostSanitizer, (req, res) => {
        PostModel.findByIdAndUpdate(req.url.readObjectID(), req.body.post, {new: true})
            .then(foundPost => {
                req.flash('info', 'Post have been successfully updated!');
                res.redirect("/post/" + foundPost._id);
            })
            .catch(err => {
                req.flash('error', err.toString());
                res.redirect('back');
            });
    })
    .delete((req, res) => { // todo: trash can || double check
        PostModel.postsDeleteThenDissociate(req.url.readObjectID(), req.user)
            .then(() => req.flash('info', 'Post have been successfully deleted!'))
            .then(() => res.redirect("/post"))
            .catch(err => {
                req.flash('error', err.toString());
                res.redirect('/console');
            });
    });


// editor - existed (alias in its canonicalKey)
router.get('/editor/:KEY', _pre.isAuthorized, (req, res) => {
        PostModel.findOne({canonicalKey: req.params.KEY})
            .then(foundPost => {
                if (!doc) {
                    req.flash('error', 'Nothing were found...');
                    res.redirect('back');
                }
                req.session.foundPost = foundPost;
                res.redirect(`/post/editor/${req.session.foundPost._doc._id}`);
            })
            .catch(err => {
                console.log(err);
                if (err) req.flash('error', err.toString());
                res.redirect('back');
            });
    });


// show - post
router
    .get(/^\/[a-f\d]{24}(\/)?$/, (req, res) => {  // note: match all valid ObjectID format
        PostModel.findById(req.url.readObjectID())
            .then(foundPost => {
                req.session.foundPost = foundPost;
                res.redirect(`/post/${req.session.foundPost._doc.canonicalKey}`);
            })
            .catch(err => {
                if (err) req.flash('error', err.toString());
                res.redirect('back');
            });
    })
    .get('/:KEY', (req, res) => {
        if (req.session._doc && req.params.KEY === req.session.foundPost._doc.canonicalKey) {
            const foundPost = req.session.foundPost;
            delete req.session.foundPost;
            return renderWithDoc(req, res, './theme/post/post', foundPost);
        }
        PostModel.findOne({canonicalKey: req.params.KEY})
            .then(foundPost => renderWithDoc(req, res, './theme/post/post', foundPost))
            .catch(err => {
                if (err) req.flash('error', err.toString());
                res.redirect('back');
            });
    });


// show - list
router.get('/', (req, res) => {
    PostModel.find()
        .then(AllPosts => res.render("./theme/post/index", {posts : AllPosts.reverse()}))
        .catch(err => {
            req.flash('error', err.toString());
            res.redirect('back');
        });
});



// extracted end-ware
function renderWithDoc(req, res, view, doc) {
    if (!doc) {
        req.flash('error', 'Nothing were found...');
        res.redirect('back');
    }
    _pre.prependTitleTag(doc.title)(req, res);
    doc.content = req.sanitize(doc.content);
    res.render(view, {post: doc, page: {}})
}



// route exports
module.exports  = router;
