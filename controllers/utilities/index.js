const utilities = {
  _U_: {
    string: require('./string'),
    object: require('./object'),
    error: require('./error'),
  },
};


utilities[Symbol.for('UNIT_TEST')] = {
  ...utilities._U_.string,
  ...utilities._U_.object,
  ...utilities._U_.error,
};


// exports
module.exports = utilities;
