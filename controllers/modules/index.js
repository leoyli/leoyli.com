const auth = require('./auth');
const header = require('./header');
const helper = require('./helper');
const { paginatedQuery } = require('./query/packet');
const { handleStreamUpload } = require('./upload/packet');


// exports
module.exports = { _M_: { ...auth, ...helper, ...header, paginatedQuery, handleStreamUpload } };
