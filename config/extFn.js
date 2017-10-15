exports = module.exports = {};

// extracted function
exports.normalization = (data, user, next) => {
    const haveCallback = (typeof user === 'function' || typeof next === 'function') && typeof user !== typeof next;

    // callback correction
    if (haveCallback && !next) {   // note: i.e. 'user' is misplaced as in `fn(data, callback)`
        next = user;
        user = null;
    }

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
