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
        res.render("post/", {posts : foundPosts});
    });
});


// new
router.get('/new', gate.isSignedIn, function (req, res) {
    res.render('console/editor', {post : new PostModel()});
});


// create
router.post('/', gate.isSignedIn, gate.putSanitizer, function (req, res) {
    PostModel.create(req.body.post, function (err, newPost) {
        if (err) return res.send(err);  // todo: hide from user

        // associate user & post
        req.user.ownedPosts.push(newPost);
        req.user.save(function (err, pushedUser) {
            if (err) return res.send(err);  // todo: hide from user
            req.flash('info', 'Post have been successfully posted!');
            res.redirect('/post');
        });
    });
});


// edit
router.get('/:POSTID/edit', gate.isSignedIn, gate.isAuthorized, function (req, res) {
    PostModel.findById(req.params.POSTID, function (err, foundPost) {
        if (err) return res.send(err);  // todo: hide from user
        res.render('console/editor', {post : foundPost});
    });
});


// update
router.put('/:POSTID', gate.isSignedIn, gate.isAuthorized, gate.putSanitizer, function (req, res) {
    PostModel.findByIdAndUpdate(req.params.POSTID, req.body.post, {new: true}, function (err, foundPost) {
        if (err) return res.send(err);  // todo: hide from user
        foundPost.reviseCounter();
        req.flash('info', 'Post have been successfully updated!');
        res.redirect("/post/" + foundPost._id);
    });
});


// destroy  // todo: post recycling
router.delete('/:POSTID', gate.isSignedIn, gate.isAuthorized, function (req, res) {
    PostModel.findByIdAndRemove(req.params.POSTID, function (err) {
        if (err) return res.send(err);  // todo: hide from user
        req.flash('info', 'Post have been successfully deleted!');
        res.redirect("/post");
    });
});


// show
router.get('/:POSTID', function (req, res) {
    PostModel.findById(req.params.POSTID, function (err, foundPost) {
        if (err || foundPost === null) {
            req.flash('error', 'UnfoundedPostError: NOTHING BEING FOUND.');   // todo: error control
            return res.redirect('/post');   // todo: hide from user
        }
        foundPost.content = req.sanitize(foundPost.content);
        res.render('post/post', {post: foundPost});
    });
});


// route exports
module.exports  = router;
