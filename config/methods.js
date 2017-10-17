exports = module.exports = {};



// normalization
exports.normalization = (data, user, next) => {
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
    if (data.length === 0 || !data[0]) return next(new Error('NO DATA BEING PROVIDED.'), null);

    return [data, user, next];
};


// correlation handler
exports.correlateAsCreateOrDelete = function (data, user, next, correlatedListName, operator, _THIS) {
    return (async (data, user, next) => {
        // create/remove the doc(s)
        if (operator === '$pullAll') {
            await _THIS.remove({_id: data});
        } else if (operator === '$push') {
            if (user) await data.map(self => self.provider = user);
            data = await _THIS.create(data);    // note: this line reassign the following 'data'
        } else {
            throw new SyntaxError('Operator must be either \'$push\' (create) or \'$pullAll\' (delete)');
        }

        // push/pull user's owned list  // note: maybe it is not necessary have to do dissociation
        if (user && correlatedListName) {
            const query = {}, wrapper = {};
            // note: $pullAll is not de deprecated: cannot use $each on $pull
            query[`docLists.${correlatedListName}`] = (operator === '$push') ? {$each: data} : data;
            wrapper[`${operator}`] = query;
            await user.update(wrapper);
        }

        return next(null, data);
    })(...exports.normalization(data, user, next));
};
