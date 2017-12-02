module.exports = exports = { _fn: { string: {}, schema: {} }};



// ==============================
//  STRING METHODS
// ==============================
const _ = require('lodash');
exports._fn.string = {
    escapeInHTML: (str) =>_.escape(str),
    canonicalize: (str) =>_.kebabCase(str),
    readObjectID: (str) => {
        const value = /[a-f\d]{24}(\/)?/.exec(str);
        return value ? value[0]: value;
    },
    parseNestKey: (str) => {
        if (!str || /[^a-zA-Z0-9_$.\[\]]/g.test(str)) {
            throw new SyntaxError('String cannot have special characters other than ".$[]".');
        } else return str.match(/[a-zA-Z0-9_$]+/g);
    }
};



// ==============================
//  SCHEMA METHODS
// ==============================
// arguments normalization
const _normalizeArguments = function(data, user, next) {
    // correction  // note: i.e. 'user' is misplaced as in `fn(data, callback)`
    [user, next] = ((arguments.length === 2) && (typeof user === 'function')) ? [null, user] : [user, next];

    // default
    if (!next) next = (err, docs) => {
        if (err) throw err;
        return docs;
    };

    // normalization
    if (!Array.isArray(data)) data = [data];
    if (data.length === 0 || !data[0]) return next(new ReferenceError('Nothing were provided...'), null);

    return [data, user, next];
};


// doc correlations
exports._fn.schema.updateAndBind = function(data, user, next, fieldName, operator, _THIS) {
    return (async (data, user, next) => {
        switch (operator) {
            case '$pullAll':
                await _THIS.remove({ _id: data });
                break;
            case '$push':
                if (user) await data.map(self => self.author = user);
                data = await _THIS.create(data);    // note: this line reassign the following 'data'
                break;
            default:
                return next(new ReferenceError('Operator must be either \'$push\' or \'$pullAll\''), null);
        } return next(null, data);
    })(..._normalizeArguments(data, user, next));
};


// promisification
exports._fn.schema.promisify = (fn, arg, THIS) => {     // note: fn have to be pre-assigned as anther variable if replacing itself
    if (typeof arg[arg.length-1] === 'function') return fn.call(THIS, ...arg);
    return new Promise((resolve, reject) => fn.call(THIS, ...arg, (err, result) => {
        if (err) return reject(err);
        else return resolve(result);
    }));
};