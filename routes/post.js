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
const gate                  = require('../config/middleware');



// ==============================
//  ROUTE RULES
// ==============================
// editor - new
router
    .route(['/editor', '/editor/new'])
    .all(gate.isSignedIn)
    .get((req, res) => {
        res.render('console/editor', {post : new PostModel({_id: null}), page: {}});
    })
    .post(gate.putSanitizer, (req, res) => {
        // associate input array with the author then create
        req.body.post.author = {_id: req.user._id, username: req.user.username};
        PostModel.postsCreateAndAssociate(req, res, req.body.post)
            .then(registeredPost => {
                req.flash('info', 'Post have been successfully posted!');
                res.redirect('/post');
            })
            .catch(err => res.send(err));       // todo: error handling
    });


// editor - existed
router
    .route('/editor/:POSTID')
    .all(gate.isAuthorized)
    .get((req, res) => {
        PostModel.findById(req.params.POSTID)
            .then(foundPost => {
                foundPost.content = req.sanitize(foundPost.content);
                res.render('console/editor', {post: foundPost, page: {}})
            })
            .catch(err => res.send(err));       // todo: error handling
    })
    .put(gate.putSanitizer, (req, res) => {
        PostModel.findByIdAndUpdate(req.params.POSTID, req.body.post, {new: true})  // todo: versioning integration
            .then(foundPost => {
                foundPost.reviseCounter();
                req.flash('info', 'Post have been successfully updated!');
                res.redirect("/post/" + foundPost._id);
            })
            .catch(err => res.send(err));       // todo: error handling
    })
    .delete((req, res) => {                     // todo: post recycling
        PostModel.findByIdAndRemove(req.params.POSTID)
            .then(() => {
                req.flash('info', 'Post have been successfully deleted!');
                res.redirect("/post");
            })
            .catch(err => res.send(err));       // todo: error handling
    });


// show - post
router.get('/:POSTID', (req, res) => {
    PostModel.findById(req.params.POSTID)
        .then(foundPost => {
            foundPost.content = req.sanitize(foundPost.content);
            res.render('post/post', {post: foundPost})
        })
        .catch(err => {
            req.flash('error', 'UnfoundedPostError: NO POSTS BEING FOUND.');
            res.redirect('back');
        });
});


// show - list
router.get('/', (req, res) => {
    PostModel.find({})
        .then(AllPosts => res.render("post/", {posts : AllPosts.reverse()}))
        .catch(err => res.send(err));           // todo: error handling
});



// route exports
module.exports  = router;
