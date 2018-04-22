const { _M_ } = require('../modules/');



// controllers
const pages = {};

pages.landing = {
  GET: function pages_landing_GET(req, res, next) {
    return next();
  },
};

pages.search = {
  GET: function pages_search_GET(req, res, next) {
    return _M_.aggregateFetch('posts')(req, res, next);
  },
};



// exports
module.exports = pages;
