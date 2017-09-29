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
        // associate input array with the author
        req.body.post.author = {_id: req.user._id, username: req.user.username};

        // create/associate posts
        PostModel.postsCreateAndAssociate(req, res, req.body.post, (err, registeredPost) => {
            if (err) return res.send(err);  // todo: error handling
            req.flash('info', 'Post have been successfully posted!');
            res.redirect('/post');
        });
    });


// editor - existed
router
    .route('/editor/:POSTID')
    .all(gate.isAuthorized)
    .get((req, res) => {
        PostModel.findByIDAndSanitize(req, res, req.params.POSTID, foundPost => {
            res.render('console/editor', {post: foundPost, page: {}});
        });
    })
    .put(gate.putSanitizer, (req, res) => {
        PostModel.findByIdAndUpdate(req.params.POSTID, req.body.post, {new: true}, (err, foundPost) => {
            if (err) return res.send(err);  // todo: error handling
            foundPost.reviseCounter();
            req.flash('info', 'Post have been successfully updated!');
            res.redirect("/post/" + foundPost._id);
        });
    })
    .delete((req, res) => {   // todo: post recycling
        PostModel.findByIdAndRemove(req.params.POSTID, err => {
            if (err) return res.send(err);  // todo: error handling
            req.flash('info', 'Post have been successfully deleted!');
            res.redirect("/post");
        });
    });


// show - post
router.get('/:POSTID', (req, res) => {
    PostModel.findByIDAndSanitize(req, res, req.params.POSTID, foundPost => {
        res.render('post/post', {post: foundPost});
    });
});


// show - list
router.get('/', (req, res) => {
    PostModel.find({}, (err, AllPosts) => {
        if (err) return res.send(err);  // todo: error handling
        res.render("post/", {posts : AllPosts.reverse()});
    });
});



// route exports
module.exports  = router;
