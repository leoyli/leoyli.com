module.exports = exports = { _fn: { string: {}, schema: {} }};



// ==============================
//  On OBJECT
// ==============================
exports._fn.object = { checkNativeBrand, cloneDeep, mergeDeep, assignDeep };

/**
 * check the native brand(type) of objects  // note: `checkNativeBrand` can be generalized
 * @param {object} target                   - object to be checked
 * @param {string} [source=null]            - name to be matched (case insensitive)
 * @return {(boolean|string)}               - if no name given, the brand name of the object would be returned
 */
function checkNativeBrand(target, source) {
    if (source) return Object.prototype.toString.call(target).slice(8, -1).toLowerCase() === source.toLowerCase();
    else return Object.prototype.toString.call(target).slice(8, -1);
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
    const obj = mutate === true ? target : cloneDeep(target);
    mergeRecursion(obj, source);
    return obj;
}


/**
 * assigned the value to an object by path  // note: can be set to mutable      // note: value could be 0{number}
 * @param {object} target                   - target{object} to be operated
 * @param {string|array} path               - referencing path of the object
 * @param {*} [value]                       - value{*} to be assigned
 * @param {boolean} [mutate=false]          - allow to mutate the target object
 * @return {object}                         - the assigned object
 */
function assignDeep(target, path, value, { mutate } = {}) {
    function assignRecursion(obj, path, value) {
        const keys = checkNativeBrand(path, 'string') ? exports._fn.string.readObjPath(path) : path;
        if (keys.length !== 1) {
            assignRecursion(obj[keys[0]] !== undefined ? obj[keys[0]] : (obj[keys[0]] = {}), keys.slice(1), value);
        } else obj[keys[0]] = value !== undefined ? value : {};
    }
    const obj = mutate === true ? target : cloneDeep(target);
    assignRecursion(obj, path, value);
    return obj;
}



// ==============================
//  STRING METHODS
// ==============================
exports._fn.string = { escapeChars, toKebabCase, readMongoId, readObjPath, inspectFileURL };

/**
 * convert string to kebabCase
 * @param {string} str                      - any arbitrary string
 * @return {string}                         - kebabCased string
 */
function toKebabCase(str) {
    return (str || '')
        .replace(/([a-z])([A-Z])/g, '$1-$2')                                // handle CamelCase
        .replace(/(-([A-Z])([A-Z]))/g, '-$2-$3')                            // handle signal words in CamelCase
        .replace(/[`'":;,.?!@#$%^&*_=~(){}<>/\\\[\]\-\+\|\s]+/g, '-')       // normalize special characters
        .replace(/^-+|-+$/g, '')                                            // cleanup endpoints
        .toLowerCase();
}


/** // tofix: may have searching problem, canonical value problem...
 * convert matched context to HTML entity   // note: this method allows `null` or `undefined` argument
 * @param {string} str                      - any arbitrary string
 * @return {string|undefined}               - escaped string, only key HTML entities are escaped
 */
function escapeChars(str) {
    const charMap = {
        ' ': '&#32;', '=': '&#61;', "'": '&#39;', '"': '&#34;', '`': '&#96;', '.': '&#46;',
        ',': '&#44;', ':': '&#58;', ';': '&#59;', '<': '&#60;', '(': '&#40;', '[': '&#91;', '{': '&#123;',
    };
    return str === undefined ? undefined : str.replace(/[\s='"`.,:;<([{]/g, char => charMap[char]);
}


/**
 * parse Mongo ObjectId (hexadecimal)
 * @param {string} str                      - any arbitrary string
 * @return {string}                         - hexadecimal{string}
 */
function readMongoId(str) {
    const output = /(?:\=|\/|^)([a-f\d]{24})(?:\?|\/|$)/i.exec(str);
    if (output === null) throw new Error(`No Mongo ObjectId in ${str} can be read.`);
    else return output[1].toLowerCase();
}


/**
 * transpile string to object path array
 * @param {string} str                      - any arbitrary string
 * @return {array}                          - an array contains elements in ordered by nest keys (path)
 */
function readObjPath(str) {
    return str.match(/[a-zA-Z0-9_$]+/g);
}


/**
 * inspect the given file URL
 * @param {string} str                      - any arbitrary string
 * @param {array} extName                   - accepted file extension names
 * @param {boolean} [raw=true]              - give the raw result(true) or string(false)
 * @param {string} [use='https']            - set the use for the direct output
 * @return {string|array|null}              - direct outputted string or raw result or null
 */
function inspectFileURL(str, extName, { raw = true , use = 'https' } = {}) {
    const protocolExp   = '(?:(https?):\/\/)';
    const fileNameExp   = `([0-9a-z\\s\\._%-]+\.(?:${extName.join('|')})`;
    const domainExp     = '((?:[0-9a-z%-]+\\.(?!\\.))+[a-z]+)';
    const pathExp       = '(\\/(?:[0-9a-z\\/\\s\\._%-]+\\/)?)';
    const URLExp        = `^${protocolExp}?${domainExp}${pathExp}${fileNameExp}$)`;
    const result        = new RegExp(URLExp, 'i').exec(str);
    const filtrate      = Array.isArray(result) ? (use || result[1]) + '://' + result.slice(2, 5).join('') : null;
    return raw === false ? filtrate : result;
}


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



// export test
exports._test = { ...exports._fn.string, ...exports._fn.object };
