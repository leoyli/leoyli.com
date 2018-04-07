module.exports = pages = {};



// ==============================
//  DEPENDENCIES
// ==============================
const { _U_ } = require('../utilities/');
const { fetch } = require('../middleware/fetch');



// ==============================
//  CONTROLLERS
// ==============================
pages.search = {
  GET: fetch('posts'),
};
