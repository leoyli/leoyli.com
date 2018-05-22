const { _M_ } = require('../modules/');
const { _U_ } = require('../utilities/');
const { PostsModel } = require('../../models/');


// controllers
const blog = {};

blog.edit = {
  alias: async function blog_edit_alias(req, res) {
    const post = await PostsModel.findOne({ canonical: req.params.canonical });
    if (!post) throw new _U_.error.HttpException(404);
    req.session.cache = { post };
    return res.redirect(`/blog/${req.session.cache.post._id}/edit`);
  },
  GET: async function blog_edit_GET(req, res, next) {
    if (req.url.match(/^\/(edit|new)\/?$/)) req.session.cache = { post: new PostsModel() };
    else if (!req.session.cache
        || !req.session.cache.post
        || !req.url.includes(req.session.cache.post._id)) {
      req.session.cache = { post: await PostsModel.findById(_U_.string.parseMongoObjectId(req.url)) };
    }
    return next();
  },
};


blog.post = {
  alias: async function blog_post_alias(req, res, next) {
    if (!req.session.cache
        || !req.session.cache.post
        || req.session.cache.post.canonical !== req.params.canonical) {
      req.session.cache = { post: await PostsModel.findOne({
        canonical: req.params.canonical, 'time._recycled': { $eq: null },
      }) };
    }
    return next();
  },
  GET: async function blog_post_GET(req, res) {
    const post = await PostsModel.findOne({ _id: req.params[0], 'time._recycled': { $eq: null } });
    if (!post) throw new _U_.error.HttpException(404);
    req.session.cache = { post };
    return res.redirect(`/blog/${req.session.cache.post.canonical}`);
  },
  PUT: async function blog_post_PUT(req, res) {
    const post = await PostsModel.update(
      { _id: _U_.string.parseMongoObjectId(req.url) },
      { $set: req.body.post },
      { new: true },
    );
    if (post) req.session.cache = { post };
    req.flash('info', 'post have been successfully updated!');
    return res.redirect(`/blog/${post.canonical}`);
  },
  DELETE: async function blog_post_DELETE(req, res) {
    await PostsModel.remove({ _id: _U_.string.parseMongoObjectId(req.url) });
    req.flash('info', 'post have been successfully deleted!');
    return res.redirect('/blog/');
  },
};


blog.list = {
  GET: function blog_list_GET(req, res, next) {
    return _M_.paginatedQuery('posts')(req, res, next);
  },
  POST: async function blog_list_POST(req, res) {
    await PostsModel.create({ author: req.session.user, ...req.body.post });
    req.flash('info', 'post have been successfully posted!');
    return res.redirect('/blog/');
  },
};


// exports
module.exports = { blog };

Object.defineProperty(module.exports, Symbol.for('__TEST__'), {
  value: {
    ...module.exports,
  },
});
