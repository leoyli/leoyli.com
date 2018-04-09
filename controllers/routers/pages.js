module.exports = pages = {};



// ==============================
//  DEPENDENCIES
// ==============================
const { _U_ } = require('../utilities/');
const { fetch } = require('../middleware/fetch');



// ==============================
//  CONTROLLERS
// ==============================
pages.landing = {
  GET: (req, res, next) => next()
};

pages.search = {
  GET: (req, res, next) => fetch('posts')(req, res, next),
};
