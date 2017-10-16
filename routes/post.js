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
    .get((req, res) => res.render('console/editor', {post : new PostModel({_id: null}), page: {}}))
    .post(gate.putPostSanitizer, (req, res) => {
        PostModel.postsCreateThenAssociate(req.body.post, req.user)
            .then(() => req.flash('info', 'Post have been successfully posted!')) // note: ()=> is ensured the sequence
            .then(() => res.redirect('/post'))
            .catch(err => {
                req.flash('error', err.toString());
                res.redirect('back');
            });
    });


// editor - existed
router
    .route('/editor/:POSTID')
    .all(gate.isAuthorized)     // todo: page validation (if not found, send the correct message)
    .get((req, res) => {
        PostModel.findById(req.params.POSTID)
            .then(foundPost => {
                if (!foundPost) return res.redirect('back');
                foundPost.content = req.sanitize(foundPost.content);
                res.render('console/editor', {post: foundPost, page: {}})
            })
            .catch(err => {
                req.flash('error', err.toString());
                res.redirect('back');
            });
    })
    .patch(gate.putPostSanitizer, (req, res) => {
        PostModel.findByIdAndUpdate(req.params.POSTID, req.body.post, {new: true})  // todo: versioning integration
            .then(foundPost => {
                foundPost.reviseCounter();
                req.flash('info', 'Post have been successfully updated!');
                res.redirect("/post/" + foundPost._id);
            })
            .catch(err => {
                req.flash('error', err.toString());
                res.redirect('back');
            });
    })
    .delete((req, res) => { // todo: post recycling;
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
        .catch(err => {
            req.flash('error', err.toString());
            res.redirect('back');
        });
});



// route exports
module.exports  = router;
