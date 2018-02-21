module.exports = exports = { _$: {
    schema  : require('./schema'),
    string  : require('./string'),
    object  : require('./object'),
    error   : require('./error'),
}};
exports._test = { ...exports._$.schema, ...exports._$.string, ...exports._$.object, ...exports.error };
