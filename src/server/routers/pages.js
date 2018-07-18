const { _M_ } = require('../modules');


// controllers
const pages = {};

pages.search = {
  GET: function pages_search_GET(req, res, next) {
    return _M_.paginatedQuery('posts')(req, res, next);
  },
};


// exports
module.exports = { pages };

Object.defineProperty(module.exports, Symbol.for('__TEST__'), {
  value: {
    ...module.exports,
  },
});
