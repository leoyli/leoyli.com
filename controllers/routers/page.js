const { _M_ } = require('../modules/');


// controllers
const page = {};

page.search = {
  GET: function page_search_GET(req, res, next) {
    return _M_.aggregateFetch('posts')(req, res, next);
  },
};

page.edit = {
  GET: function page_landing_GET(req, res, next) {
    return next();
  },
};

page.show = {
  GET: function page_landing_GET(req, res, next) {
    return next();
  },
};

page.root = {
  GET: function page_landing_GET(req, res, next) {
    return next();
  },
};


// exports
module.exports = page;
