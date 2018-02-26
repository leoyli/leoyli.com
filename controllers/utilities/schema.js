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
function updateAndBind(data, user, next, fieldName, operator, _THIS) {
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
}


// promisification
function promisify(fn, arg, THIS) {     // note: fn have to be pre-assigned as anther variable if replacing itself
    if (typeof arg[arg.length-1] === 'function') return fn.call(THIS, ...arg);
    return new Promise((resolve, reject) => fn.call(THIS, ...arg, (err, result) => {
        if (err) return reject(err);
        else return resolve(result);
    }));
}



// exports
module.exports = { updateAndBind, promisify };
