/**
 * check the native brand(type) of objects  // note: `checkNativeBrand` can be generalized
 * @param {object} target                   - object to be checked
 * @param {string} [str]                    - name to be matched (case insensitive)
 * @return {(boolean|string)}               - if no name given, the brand name of the object would be returned
 */
function checkNativeBrand(target, str) {
    if (str && typeof str !== 'string') throw new TypeError(`${str} is not a string.`);
    if (str) return Object.prototype.toString.call(target).slice(8, -1).toLowerCase() === str.toLowerCase();
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
        const keys = checkNativeBrand(path, 'string') ? require('./string').readObjPath(path) : path;
        if (keys.length !== 1) {
            assignRecursion(obj[keys[0]] !== undefined ? obj[keys[0]] : (obj[keys[0]] = {}), keys.slice(1), value);
        } else obj[keys[0]] = value !== undefined ? value : {};
    }
    const obj = mutate === true ? target : cloneDeep(target);
    assignRecursion(obj, path, value);
    return obj;
}



// exports
module.exports = { checkNativeBrand, cloneDeep, mergeDeep, assignDeep };
