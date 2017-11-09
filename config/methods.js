exports = module.exports = {};
const _ = require('lodash');



// String prototype extension
exports.string = {
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


// normalization
exports.schema = {
    normalization: function(data, user, next) {
        const haveCallback = (typeof user === 'function' || typeof next === 'function') && typeof user !== typeof next;

        // callback correction  // note: i.e. 'user' is misplaced as in `fn(data, callback)`
        [next, user] = (haveCallback && !next) ? [user, null] : [next, user];

        // callback pre-assignment
        if (!haveCallback) next = (err, docs) => {
            if (err) throw err;
            return docs;
        };

        // normalization
        if (!Array.isArray(data)) data = [data];
        if (data.length === 0 || !data[0]) return next(new ReferenceError('Nothing were provided...'), null);

        return [data, user, next];
    },
    updateAndBind: function(data, user, next, fieldName, operator, _THIS) {
        return (async (data, user, next) => {
            // create/remove the doc(s)
            switch (operator) {
                case '$pullAll':
                    await _THIS.remove({_id: data});
                    break;
                case '$push':
                    if (user) await data.map(self => self.provider = user);
                    data = await _THIS.create(data);    // note: this line reassign the following 'data'
                    break;
                default:
                    throw new SyntaxError('Operator must be either \'$push\' (create) or \'$pullAll\' (delete)');
            }

            // push/pull user's owned list  // note: maybe it is not necessary have to do dissociation
            if (user && fieldName) {
                const query = {[operator]: {[`docLists.${fieldName}`]: (operator === '$push') ? {$each: data} : data}};
                // note: $pullAll is not de deprecated: cannot use $each on $pull
                await user.update(query);
            }

            return next(null, data);
        })(...exports.schema.normalization(data, user, next));
    },
    promisify: (fn, arg, THIS) => {
        if (typeof arg[arg.length-1] === 'function') return fn.call(THIS, ...arg);
        return new Promise((resolve, reject) => fn.call(THIS, ...arg, (err, result) => {
            if (err) return reject(err);
            resolve(result);
        }));
    },
};
