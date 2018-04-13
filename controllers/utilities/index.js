module.exports = exports = { _U_: {
    string  : require('./string'),
    object  : require('./object'),
    error   : require('./error'),
  }};



// exports
exports._test = { ...exports._U_.schema, ...exports._U_.string, ...exports._U_.object, ...exports.error };
