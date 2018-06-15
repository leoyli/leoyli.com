const { _M_ } = require('../modules/');


// controllers
const page = {};

page.search = {
  GET: function page_search_GET(req, res, next) {
    return _M_.paginatedQuery('posts')(req, res, next);
  },
};


page.edit = {
  GET: function page_edit_GET(req, res, next) {
    return next();
  },
};


page.show = {
  GET: function page_show_GET(req, res, next) {
    return next();
  },
};


page.root = {
  GET: function page_root_GET(req, res, next) {
    return next();
  },
};


// exports
module.exports = { page };

Object.defineProperty(module.exports, Symbol.for('__TEST__'), {
  value: {
    ...module.exports,
  },
});
