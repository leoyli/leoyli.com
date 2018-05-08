const { _M_ } = require('../modules/');
const { _U_ } = require('../utilities/');
const { PostsModel } = require('../../models/');


// controllers
const editor = {};

editor.new = {
  GET: function blog_editor_post_GET(req, res, next) {
    req.session.chest = { post: {} };
    return next();
  },
  POST: async function blog_editor_post_POST(req, res) {
    await PostsModel.create({ author: req.session.user, ...req.body.post });
    req.flash('info', 'post have been successfully posted!');
    return res.redirect('/blog');
  },
};


editor.post = {
  alias: async function blog_editor_edit_alias(req, res) {
    req.session.chest = { post: await PostsModel.findOne(req.params) };
    return res.redirect(`/blog/${req.session.chest.post._id}/edit`);
  },
  GET: async function blog_editor_edit_GET(req, res, next) {
    if (!req.session.chest) req.session.chest = { post: await PostsModel.findById(_U_.string.parseMongoObjectId(req.url)) };
    return next();
  },

};


const blog = {};

blog.post = {
  alias: async function blog_post_alias(req, res) {                                                                                          // tofix: revise alias behavior (merged into `postHandler`)
    const post = await PostsModel.findOne({ ...req.params, 'time._recycled': { $eq: null } });
    if (!post) throw new _U_.error.HttpException(404);
    else req.session.chest = { post };
    return res.redirect(`/blog/${req.session.chest.post.canonical}`);
  },
  GET: async function blog_post_GET(req, res, next) {                                                                                      // tofix: post not found page
    if (!req.session.chest) {
      req.session.chest = {
        post: await PostsModel.findOne({ canonical: req.params[0], 'time._recycled': { $eq: null } }),
      };
    }
    return next();
  },
  PATCH: async function blog_post_PATCH(req, res) {
    await PostsModel.update({ _id: _U_.string.parseMongoObjectId(req.url) }, { $set: req.body.post }, { new: true });
    req.flash('info', 'post have been successfully updated!');
    return res.redirect(`/blog/${_U_.string.parseMongoObjectId(req.url)}`);
  },
  DELETE: async function blog_post_DELETE(req, res) {
    await PostsModel.remove({ _id: _U_.string.parseMongoObjectId(req.url) });
    req.flash('info', 'post have been successfully deleted!');
    return res.redirect('/blog/');
  },
};


blog.list = {
  GET: function blog_list_GET(req, res, next) {
    return _U_.express.wrapMiddleware(_M_.aggregateFetch('posts'))(req, res, next);
  },
};


// exports
module.exports = { editor, blog };
