const { _M_ } = require('../controllers/modules');
const { _U_ } = require('../utilities');
const { PostsModel } = require('../models');


// controllers
const blog = {};

blog.post = {
  GET: async function blog_post_GET(req, res, next) {
    const mongoId = _U_.string.parseMongoObjectId(req.params.key);
    const search = mongoId ? { _id: mongoId } : { canonical: req.params.key };
    const query = { ...search, 'time._recycled': { $eq: null } };
    const post = await PostsModel.findOne(query);
    if (!post) throw new _U_.error.HttpException(404);
    res.locals.data = { ...res.locals.data, post };
    return next();
  },
  PUT: async function blog_post_PUT(req, res, next) {
    const post = await PostsModel.findOneAndUpdate(
      { _id: _U_.string.parseMongoObjectId(req.url) },
      { $set: req.body.post },
      { new: true },
    );
    res.locals.data = { ...res.locals.data, post };
    return next();
  },
  DELETE: async function blog_post_DELETE(req, res, next) {
    const result = await PostsModel.update(
      { _id: _U_.string.parseMongoObjectId(req.url) },
      { $set: { 'state.recycled': true } },
      { multi: false },
    );
    res.locals.data = { ...res.locals.data, result };
    return next();
  },
};


blog.list = {
  GET: function blog_list_GET(req, res, next) {
    return _M_.paginatedQuery('posts')(req, res, next);
  },
  POST: async function blog_list_POST(req, res, next) {
    const post = await PostsModel.create({
      ...req.body.post,
      author: { _id: req.session.user.sub, nickname: 'admin' },
    });
    res.locals.data = { ...res.locals.data, post };
    return next();
  },
};


blog.search = {
  GET: function blog_search_GET(req, res, next) {
    return _M_.paginatedQuery('posts')(req, res, next);
  },
};


// exports
module.exports = { blog };

Object.defineProperty(module.exports, Symbol.for('__TEST__'), {
  value: {
    ...module.exports,
  },
});
