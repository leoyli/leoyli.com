var express                 = require('express'),
    router                  = express.Router(),
    passport                = require('passport');



// ==============================
//  MODELS
// ==============================
var PostModel               = require('../models/post');



// ==============================
//  MIDDLEWARE
// ==============================
var gate                    = require('../config/middleware');



// ==============================
//  ROUTE RULES
// ==============================
// index
router.get('/', function (req, res) {
    PostModel.find({}, function (err, foundPosts) {
        if (err) return res.send(err);  // todo: hide from user
        return res.render("post/", {posts : foundPosts});
    });
});


// new
router.get('/new', gate.isSignedIn, function (req, res) {
    return res.render('console/editor', {post : new PostModel()});
});


// create
router.post('/new', gate.isSignedIn, gate.putSanitizer, function (req, res) {
    // associate input array with the author
    req.body.post.author = {_id: req.user._id, username: req.user.username};

    // create the post
    PostModel.create(req.body.post, function (err, newPost) {
        if (err) return res.send(err);  // todo: hide from user

        // associate user with the post
        req.user.ownedPosts.push(newPost);
        req.user.save(function (err) {
            if (err) return res.send(err);  // todo: hide from user
            req.flash('info', 'Post have been successfully posted!');
            return res.redirect('/post');
        });
    });
});


// param handler for show & edit routes
router.param('_POSTID', function (req, res, next, POSTID) {
    PostModel.findById(POSTID, function (err, foundPost) {
        if (err || foundPost === null) {
            req.flash('error', 'UnfoundedPostError: NOTHING BEING FOUND.');   // todo: error control
            return res.redirect('/post');
        }
        foundPost.content = req.sanitize(foundPost.content);
        req.loadedPost = foundPost;
        return next();
    });
});


// show
router.get('/:_POSTID', function (req, res) {
    return res.render('post/post', {post: req.loadedPost});
});


// edit
router.get('/:_POSTID/edit', gate.isAuthorized, function (req, res) {
    return res.render('console/editor', {post : req.loadedPost});
});


// update
router.put('/:POSTID', gate.isAuthorized, gate.putSanitizer, function (req, res) {
    PostModel.findByIdAndUpdate(req.params.POSTID, req.body.post, {new: true}, function (err, foundPost) {
        if (err) return res.send(err);  // todo: hide from user
        foundPost.reviseCounter();
        req.flash('info', 'Post have been successfully updated!');
        return res.redirect("/post/" + foundPost._id);
    });
});


// destroy  // todo: post recycling
router.delete('/:POSTID', gate.isAuthorized, function (req, res) {
    PostModel.findByIdAndRemove(req.params.POSTID, function (err) {
        if (err) return res.send(err);  // todo: hide from user
        req.flash('info', 'Post have been successfully deleted!');
        return res.redirect("/post");
    });
});



// route exports
module.exports  = router;
