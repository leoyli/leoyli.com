const auth = require('./auth');
const header = require('./header');
const helper = require('./helper');
const { paginatedQuery } = require('./query');
const { handleStreamUpload } = require('./upload/control');


// exports
module.exports = { _M_: { ...auth, ...helper, ...header, paginatedQuery, handleStreamUpload } };
