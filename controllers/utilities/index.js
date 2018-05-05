const utilities = {
  _U_: {
    express: require('./express'),
    object: require('./object'),
    string: require('./string'),
    error: require('./error'),
  },
};


utilities[Symbol.for('UNIT_TEST')] = {
  ...utilities._U_.express,
  ...utilities._U_.object,
  ...utilities._U_.string,
  ...utilities._U_.error,
};


// exports
module.exports = utilities;
