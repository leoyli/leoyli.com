const headers = require('./headers');
const helpers = require('./helpers');
const query = require('./query/');
const upload = require('./upload/');
const renderer = require('./render/');
const auth = require('./auth/');


// exports
module.exports = {
  _M_: {
    ...headers,
    ...helpers,
    ...query,
    ...upload,
    ...renderer,
    ...auth,
  },
};
