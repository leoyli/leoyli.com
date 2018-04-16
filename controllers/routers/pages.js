module.exports = pages = {};



// modules
const { _U_ } = require('../utilities/');
const { _M_ } = require('../middleware/');



// controllers
pages.landing = {
  GET: (req, res, next) => next()
};

pages.search = {
  GET: (req, res, next) => _M_.aggregateFetch('posts')(req, res, next),
};
