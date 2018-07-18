const auth = require('./auth');
const headers = require('./handlers/headers');
const helpers = require('./handlers/helpers');
const query = require('./query');
const renderer = require('./ssr');
const upload = require('./upload');


// exports
module.exports = {
  _M_: {
    ...auth,
    ...headers,
    ...helpers,
    ...query,
    ...renderer,
    ...upload,
  },
};
