exports = module.exports = {};

// extracted function
exports.normalization = (data, user, next, targetedFunction) => {
    const haveCallback = (typeof user === 'function' || typeof next === 'function') && typeof user !== typeof next;
    return new Promise((resolve, reject) => {
        // optional arguments correction
        if (haveCallback && !next) {   // note: i.e. 'user' is misplaced as in `fn(data, callback)`
            next = user;
            user = null;
        }

        // promise state handler
        if (!haveCallback) next = (err, docs) => {
            if (err) return reject(err);
            resolve(docs);
        };

        // normalization
        if (!Array.isArray(data)) data = [data];
        if (data.length === 0 || !data[0]) return next(new Error('NO DATA BEING PROVIDED.'), null);

        // normalized target
        targetedFunction(data, user, next);

        // promise state closure   // note: if 'next()' is defended
        if (haveCallback) resolve();
    });
};
