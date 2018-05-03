const regulator = require('./regulator');
const adapter = require('./adapter');


// exports
module.exports = { _M_: { ...regulator, ...adapter } };
