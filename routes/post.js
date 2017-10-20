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
    .all(_pre.isSignedIn, _pre.setPageTitle('New Post'))
    .get((req, res) => res.render('console/editor', {post : new PostModel({_id: null}), page: {}}))
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
    .route('/editor/:POSTID')
    .all(_pre.isAuthorized, _pre.setPageTitle('Post Editor'))
    .get((req, res) => {
        PostModel.findById(req.params.POSTID)
            .then(foundPost => {
                if (!foundPost) return res.redirect('back');
                _pre.setPageTitle(foundPost.title)(req, res);
                foundPost.content = req.sanitize(foundPost.content);
                res.render('console/editor', {post: foundPost, page: {}})
            })
            .catch(err => {
                req.flash('error', err.toString());
                res.redirect('back');
            });
    })
    .patch(_pre.putPostSanitizer, (req, res) => {
        PostModel.findByIdAndUpdate(req.params.POSTID, req.body.post, {new: true})
            .then(foundPost => {
                req.flash('info', 'Post have been successfully updated!');
                res.redirect("/post/" + foundPost._id);
            })
            .catch(err => {
                req.flash('error', err.toString());
                res.redirect('back');
            });
    })
    .delete((req, res) => { // todo: trash can
        PostModel.postsDeleteThenDissociate(req.params.POSTID, req.user)
            .then(() => req.flash('info', 'Post have been successfully deleted!'))
            .then(() => res.redirect("/post"))
            .catch(err => {
                req.flash('error', err.toString());
                res.redirect('/console');
            });
    });


// show - post
router.get('/:POSTID', (req, res) => {
    PostModel.findById(req.params.POSTID)
        .then(foundPost => {
            _pre.setPageTitle(foundPost.title)(req, res);
            foundPost.content = req.sanitize(foundPost.content);
            res.render('post/post', {post: foundPost})
        })
        .catch(err => {
            if (err.name === 'CastError') req.flash('error', 'UnfoundedError: NO SUCH POST.');
            res.redirect('back');
        });
});


// show - list
router.get('/', (req, res) => {
    PostModel.find()
        .then(AllPosts => res.render("post/index", {posts : AllPosts.reverse()}))
        .catch(err => {
            req.flash('error', err.toString());
            res.redirect('back');
        });
});



// route exports
module.exports  = router;
