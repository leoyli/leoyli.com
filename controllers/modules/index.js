const auth = require('./auth');
const header = require('./header');
const helper = require('./helper');
const { paginatedQuery } = require('./query');
const { parseMultipart } = require('./upload');


// exports
module.exports = { _M_: { ...auth, ...helper, ...header, paginatedQuery, parseMultipart } };
