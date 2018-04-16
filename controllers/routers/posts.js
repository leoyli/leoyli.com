module.exports = exports = { editor: {}, posts: {} };



// modules
const { _M_ } = require('../middleware/');
const { _U_ } = require('../utilities/');
const { postsModel } = require('../../models/');



// controllers
exports.editor.post = {
  GET: (req, res, next) => {
    req.session.chest = { post: {} };
    return next();
  },
  POST: async (req, res) => {
    await postsModel.create({ author: req.session.user, ...req.body.post });
    req.flash('info', 'post have been successfully posted!');
    return res.redirect('/posts');
  },
};

exports.editor.edit = {
  alias: async (req, res) => {
    req.session.chest = { post: await postsModel.findOne(req.params) };
    return res.redirect(`/posts/edit/${req.session.chest.post._id}`);
  },
  GET: async (req, res, next) => {
    if (!req.session.chest) req.session.chest = { post: await postsModel.findById(_U_.string.readMongoId(req.url)) };
    return next();
  },
  PATCH: async (req, res) => {
    await postsModel.update({ _id: _U_.string.readMongoId(req.url)}, { $set: req.body.post }, { new: true });
    req.flash('info', 'post have been successfully updated!');
    return res.redirect(`/posts/${_U_.string.readMongoId(req.url)}`);
  },
  DELETE: async (req, res) => {
    await postsModel.remove({ _id: _U_.string.readMongoId(req.url) });
    req.flash('info', 'post have been successfully deleted!');
    return res.redirect('/posts/');
  },
};

exports.posts.show = {
  alias: async (req, res) => {                                                                                          // tofix: revise alias behavior (merged into `postHandler`)
    const post = await postsModel.findOne({ ...req.params, 'time._recycled': { $eq: null }});
    if (!post) throw new _U_.error.HttpError(404);
    else req.session.chest = { post };
    return res.redirect(`/posts/${req.session.chest.post.canonical}`);
  },
  GET: async (req, res, next) => {                                                                                      // tofix: post not found page
    if (!req.session.chest) req.session.chest = {
      post : await postsModel.findOne({ canonical: req.params[0], 'time._recycled': { $eq: null }})};
    return next();
  },
};

exports.posts.list = {
  GET: _M_.aggregateFetch('posts'),
};
