module.exports = pages = {};



// modules
const { _U_ } = require('../utilities/');
const { fetch } = require('../middleware/fetch');



// controllers
pages.landing = {
  GET: (req, res, next) => next()
};

pages.search = {
  GET: (req, res, next) => fetch('posts')(req, res, next),
};
