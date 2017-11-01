exports = module.exports = {};



// String prototype extension
exports.extendStringPrototypeMethods = () => {
    String.prototype.readObjectID = function () {
        const value = /[a-f\d]{24}(\/)?/.exec(this);
        return value ? value[0]: value;
    };

    String.prototype.canonicalize = function () {
        return this.toLowerCase().replace(/[~!@#$^&*()_+`\-=\[\]\\;',.\/{}|:"<>?\s]+/g, '-').replace(/-$/, '');
    };
};


// normalization
exports.normalization = (data, user, next) => {
    const haveCallback = (typeof user === 'function' || typeof next === 'function') && typeof user !== typeof next;

    // callback correction  // note: i.e. 'user' is misplaced as in `fn(data, callback)`
    [next, user] = (haveCallback && !next) ? [user, null] : [next, user];

    // callback pre-assignment
    if (!haveCallback) next = (err, docs) => {
        debugger;
        if (err) throw err;
        return docs;
    };

    // normalization
    if (!Array.isArray(data)) data = [data];
    if (data.length === 0 || !data[0]) return next(new ReferenceError('Nothing were provided...'), null);

    return [data, user, next];
};


// correlation handler
exports.updateThenCorrelate = function (data, user, next, fieldName, operator, _THIS) {
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
    })(...exports.normalization(data, user, next));
};
