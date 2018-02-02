module.exports = exports = { _fn: { string: {}, schema: {} }};



// ==============================
//  OBJECT METHODS
// ==============================
exports._fn.object = { checkNativeBrand, cloneDeep, mergeDeep, assignDeep };

/**
 * check the native brand(type) of objects  // note: `checkNativeBrand` can be generalized
 * @param {object} obj                      - object to be checked
 * @param {string} [name=null]              - name to be matched (case insensitive)
 * @return {(boolean|string)}               - if no name given, the brand name of the object would be returned
 */
function checkNativeBrand(obj, name) {
    if (name) return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase() === name.toLowerCase();
    else return Object.prototype.toString.call(obj).slice(8, -1);
}


/**
 * clone the object totally into different memory
 * @param {object} source                   - source{object} to be cloned, not support to an Array object
 * @return {object}                         - cloned object which is allocated at different memory
 */
function cloneDeep(source) {
    return mergeDeep({}, source, { mutate: true });
}


/**
 * merge two object deeply                  // note: can be set to mutable
 * @param {object} target                   - target{object} to be operated
 * @param {object} source                   - reference object for target
 * @param {boolean} [mutate=false]          - allow to mutate the target object
 * @return {object}                         - the merged object
 */
function mergeDeep(target, source, { mutate } = {}) {
    function mergeRecursion(obj, source) {
        for(const key in source) if (source.hasOwnProperty(key) && checkNativeBrand(source[key], 'object')) {
            if (!obj.hasOwnProperty(key)) obj[key] = {};
            mergeRecursion(obj[key], source[key]);
        } else obj[key] = source[key];
    }
    const obj = ( mutate === true ) ? target : cloneDeep(target);
    mergeRecursion(obj, source);
    return obj;
}


/**
 * assigned the value to an object by path  // note: can be set to mutable
 * @param {object} target                   - target{object} to be operated
 * @param {string|array} path               - referencing path of the object
 * @param {*} value                         - value{*} to be assigned
 * @param {boolean} [mutate=false]          - allow to mutate the target object
 * @return {object}                         - the assigned object
 */
function assignDeep(target, path, value, { mutate } = {}) {
    function assignRecursion(obj, path, value) {
        const keys = checkNativeBrand(path, 'string') ? exports._fn.string.parseNestKey(path) : path;
        if (keys.length !== 1) assignRecursion(obj[keys[0]] ? obj[keys[0]] : (obj[keys[0]] = {}), keys.slice(1), value);
        else obj[keys[0]] = value ? value : {};
    }
    const obj = ( mutate === true ) ? target : cloneDeep(target);
    assignRecursion(obj, path, value);
    return obj;
}



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
