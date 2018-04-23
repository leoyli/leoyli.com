const { readObjPath } = require('./string');



/**
 * check the native brand(type) of objects                                                                              // note: `checkNativeBrand` can be generalized
 * @param {object} target                   - object to be checked
 * @param {string} [str]                    - name to be matched (case insensitive)
 * @return {(boolean|string)}               - if no name given, the brand name of the object would be returned
 */
const checkNativeBrand = (target, str) => {
  const nativeBrandName = (obj) => Object.prototype.toString.call(obj).slice(8, -1);
  if (str && nativeBrandName(str).toLowerCase() !== 'string') throw new TypeError(`Second argument is not a string.`);
  if (str) return nativeBrandName(target).toLowerCase() === str.toLowerCase();
  return nativeBrandName(target);
};


/**
 * check if object has wwn a property
 * @param {object} obj                      - target{object} to be evaluate
 * @param {string} prop                     - name of the property
 * @return {boolean}                        - evaluation result
 */
const hasOwnProperty = (obj, prop) => {
  return Object.prototype.hasOwnProperty.call(obj, prop);
};


/**
 * clone the object/array deeply by its value (reference decoupled)
 * @param {object|array} source             - source{object} to be cloned, not support to an Array object
 * @return {object|array}                   - cloned object which is allocated at different memory
 */
const cloneDeep = (source) => {
  if (!['Object', 'Array'].includes(checkNativeBrand(source))) throw new TypeError('Invalid arguments as input.');
  return mergeDeep(checkNativeBrand(source, 'Array') ? [] : {}, source, { mutate: true });
};


/**
 * merge two object recursively                                                                                         // note: this function can not copy getter/setter properties
 * @param {object} target                   - target{object} to be operated
 * @param {object} source                   - reference object for target
 * @param {boolean} [mutate = false]        - allow to mutate the target object
 * @return {object}                         - the merged object
 */
const mergeDeep = (target, source, { mutate = false } = {}) => {
  const worker = mutate === true ? target : cloneDeep(target);

  // non-tail-call recursion (parallel)
  const _mergeRecursion = (obj, source) => {
    for (const key in source) {
      if (hasOwnProperty(source, key) && checkNativeBrand(source[key], 'object')) {
        _mergeRecursion(hasOwnProperty(obj, key) ? obj[key] : (obj[key] = {}), source[key]);
      } else obj[key] = source[key];
    }
  };

  _mergeRecursion(worker, source);
  return worker;
};


/**
 * frozen the target and its property deeply
 * @param {object|array} target             - target{object} to be operated
 * @param {boolean} [mutate = false]        - allow to mutate the target object
 * @return {object|array}                   - the deeply frozen object/array
 */
const freezeDeep = (target, { mutate = false } = {}) => {
  const worker = mutate === true ? target : cloneDeep(target);

  // non-tail-call recursion (parallel)
  const _freezeRecursion = (obj) => {
    if (['Object', 'Array'].includes(checkNativeBrand(obj))) {
      for (const key in obj) if (hasOwnProperty(obj, key)) _freezeRecursion(obj[key]);
      Object.freeze(obj);
    }
  };

  _freezeRecursion(worker);
  return worker;
};


/**
 * assigned the value to an object by path recursively                                                                  // note: (1) can be set to mutable; (2) value could be 0{number}
 * @param {object} target                   - target{object} to be operated
 * @param {string|array} path               - referencing path of the object
 * @param {*} [value]                       - value{*} to be assigned
 * @param {boolean} [mutate = false]        - allow to mutate the target object
 * @return {object}                         - the assigned object
 */
const assignDeep = (target, path, value, { mutate = false } = {}) => {
  const worker = mutate === true ? target : cloneDeep(target);
  const pathStack = checkNativeBrand(path, 'string') ? readObjPath(path) : path;

  // tail-call recursion (single-file)
  const _assignRecursion = (obj, keys, value) => {
    if (keys.length > 1) {
      return _assignRecursion(obj[keys[0]] !== undefined ? obj[keys[0]] : (obj[keys[0]] = {}), keys.slice(1), value);
    } else obj[keys[0]] = value;
  };

  _assignRecursion(worker, pathStack, value);
  return worker;
};


/**
 * proxyfy the object for allowing case-insensitive access
 * @param {object} obj                      - target{object} to be operated
 * @return {object}                         - the proxyfied object
 */
const proxyfiedForCaseInsensitiveAccess = (obj) => {
  if (!checkNativeBrand(obj, 'Object')) throw new TypeError('Invalid arguments as input.');
  return new Proxy(obj, {
    get: (target, name) => {
      if (!checkNativeBrand(name, 'String')) return Reflect.get(target, name);
      return target[Object.keys(target).find(key => key.toLowerCase() === name.toLowerCase())];
    },
  });
};



// exports
module.exports = {
  checkNativeBrand,
  hasOwnProperty,
  cloneDeep,
  mergeDeep,
  assignDeep,
  freezeDeep,
  proxyfiedForCaseInsensitiveAccess,
};
