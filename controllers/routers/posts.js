const { _M_ } = require('../modules/');
const { _U_ } = require('../utilities/');
const { PostsModel } = require('../../models/');


// controllers
const posts = { editor: {}, posts: {} };

posts.editor.post = {
  GET: function posts_editor_post_GET(req, res, next) {
    req.session.chest = { post: {} };
    return next();
  },
  POST: async function posts_editor_post_POST(req, res) {
    await PostsModel.create({ author: req.session.user, ...req.body.post });
    req.flash('info', 'post have been successfully posted!');
    return res.redirect('/posts');
  },
};

posts.editor.edit = {
  alias: async function posts_editor_edit_alias(req, res) {
    req.session.chest = { post: await PostsModel.findOne(req.params) };
    return res.redirect(`/posts/edit/${req.session.chest.post._id}`);
  },
  GET: async function posts_editor_edit_GET(req, res, next) {
    if (!req.session.chest) req.session.chest = { post: await PostsModel.findById(_U_.string.readMongoId(req.url)) };
    return next();
  },
  PATCH: async function posts_editor_edit_PATCH(req, res) {
    await PostsModel.update({ _id: _U_.string.readMongoId(req.url) }, { $set: req.body.post }, { new: true });
    req.flash('info', 'post have been successfully updated!');
    return res.redirect(`/posts/${_U_.string.readMongoId(req.url)}`);
  },
  DELETE: async function posts_editor_edit_DELETE(req, res) {
    await PostsModel.remove({ _id: _U_.string.readMongoId(req.url) });
    req.flash('info', 'post have been successfully deleted!');
    return res.redirect('/posts/');
  },
};

posts.posts.show = {
  alias: async function posts_posts_show_alias(req, res) {                                                                                          // tofix: revise alias behavior (merged into `postHandler`)
    const post = await PostsModel.findOne({ ...req.params, 'time._recycled': { $eq: null } });
    if (!post) throw new _U_.error.HttpError(404);
    else req.session.chest = { post };
    return res.redirect(`/posts/${req.session.chest.post.canonical}`);
  },
  GET: async function posts_posts_show_GET(req, res, next) {                                                                                      // tofix: post not found page
    if (!req.session.chest) {
      req.session.chest = {
        post: await PostsModel.findOne({ canonical: req.params[0], 'time._recycled': { $eq: null } }),
      };
    }
    return next();
  },
};

posts.posts.list = {
  GET: _M_.aggregateFetch('posts'),
};


// exports
module.exports = posts;
