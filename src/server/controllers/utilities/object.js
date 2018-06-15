/* eslint-disable no-restricted-syntax */
const { checkToStringTag, parseObjPath } = require('./string');


/**
 * check if object has the property
 * @param {object} obj                      - object to be evaluate
 * @param {string} prop                     - name of the property
 * @return {boolean}                        - evaluation result
 */
const hasOwnKey = (obj, prop) => {
  return Object.prototype.hasOwnProperty.call(obj, prop);
};


/**
 * clone the object/array deeply by its value (reference decoupled)
 * @param {object|array} source             - referencing object
 * @return {object|array}                   - cloned object which is allocated at different memory
 */
const cloneDeep = (source) => {
  if (!['Object', 'Array'].includes(checkToStringTag(source))) throw new TypeError('Invalid arguments as input.');
  return mergeDeep(checkToStringTag(source, 'Array') ? [] : {}, source, { mutate: true });
};


/**
 * merge two object recursively                                                                                         // note: this function can not copy getter/setter properties
 * @param {object} target                   - object to be operated
 * @param {object|array} source             - referencing object
 * @param {boolean} [mutate = false]        - mutation setting
 * @return {object}                         - the merged object
 */
const mergeDeep = (target, source, { mutate = false } = {}) => {
  const worker = mutate === true ? target : cloneDeep(target);

  // non-tail-call recursion (parallel)
  const mergeRecursion = (obj, src) => {
    const srcKeys = Reflect.ownKeys(src);
    const objKeys = Reflect.ownKeys(obj);
    for (let i = srcKeys.length - 1, currentKey = srcKeys[i]; i > -1; currentKey = srcKeys[i -= 1]) {
      if (checkToStringTag(src[currentKey], 'Object')) {
        if (!objKeys.includes(currentKey)) obj[currentKey] = {};
        mergeRecursion(obj[currentKey], src[currentKey]);
      } else obj[currentKey] = src[currentKey];
    }
  };

  mergeRecursion(worker, source);
  return worker;
};


/**
 * assigned the value to an object by path recursively                                                                  // note: (1) can be set to mutable; (2) value could be 0{number}
 * @param {object} target                   - object to be operated
 * @param {string|array} path               - assigning object path
 * @param {*} [value]                       - value to be assigned (by reference)
 * @param {boolean} [mutate = false]        - mutation setting
 * @return {object}                         - the assigned object
 */
const assignDeep = (target, path, value, { mutate = false } = {}) => {
  const worker = mutate === true ? target : cloneDeep(target);
  const pathStack = checkToStringTag(path, 'String') ? parseObjPath(path) : path;

  // tail-call recursion (single-file)
  const assignRecursion = (obj, keys) => {
    if (keys.length === 1) obj[keys[0]] = value;
    else {
      if (obj[keys[0]] === undefined) obj[keys[0]] = {};
      return assignRecursion(obj[keys[0]], keys.slice(1), value);
    }
  };

  assignRecursion(worker, pathStack, value);
  return worker;
};


/**
 * frozen the target and its property deeply
 * @param {object|array} target             - object to be operated
 * @param {boolean} [mutate = false]        - mutation setting
 * @return {object|array}                   - the frozen object/array
 */
const freezeDeep = (target, { mutate = false } = {}) => {
  const worker = mutate === true ? target : cloneDeep(target);

  // non-tail-call recursion (parallel)
  const freezeRecursion = (obj) => {
    if (['Object', 'Array'].includes(checkToStringTag(obj))) {
      const objKeys = Reflect.ownKeys(obj);
      for (let i = objKeys.length - 1; i > -1; i -= 1) freezeRecursion(obj[objKeys[i]]);
      Object.freeze(obj);
    }
  };

  freezeRecursion(worker);
  return worker;
};


/**
 * burst array in a nested object based on a given position in all array
 * @param {object} target                   - object to be operated
 * @param {boolean} [mutate = false]        - mutation setting
 * @param {number} [position = -1]          - position in the array (0 = first-one-win; -1 = last-one-win)
 * @return {object}                         - the resulted object
 */
const burstArrayDeep = (target, { mutate = false, position = -1 } = {}) => {
  const worker = mutate === true ? target : cloneDeep(target);
  const index = Number(position);

  // non-tail-call recursion (parallel)
  const burstArrayRecursion = (obj) => {
    const keys = Object.keys(obj);
    for (let i = keys.length - 1, key = keys[i]; i > -1; key = keys[i -= 1]) {
      const type = checkToStringTag(obj[key]);
      if (type === 'Array') obj[key] = obj[key][index < 0 ? obj[key].length + index : index];
      if (type === 'Object') burstArrayRecursion(obj[key]);
    }
  };

  burstArrayRecursion(worker);
  return worker;
};


/**
 * (decorator) proxyfy the object for allowing case-insensitive access
 * @param {object} obj                      - object to be delegated
 * @param {boolean} [reverse = true]        - reverse the inspection direction
 * @return {object}                         - the resulted proxy
 */
const createCaseInsensitiveProxy = (obj, { reverse = true } = {}) => {
  if (!checkToStringTag(obj, 'Object')) throw new TypeError('Invalid arguments as input.');
  return new Proxy(obj, {
    get: (target, name) => {
      if (!checkToStringTag(name, 'String')) return Reflect.get(target, name);
      if (reverse === false) return target[Object.keys(target).find(key => key.toLowerCase() === name.toLowerCase())];
      return target[Object.keys(target).reverse().find(key => key.toLowerCase() === name.toLowerCase())];
    },
  });
};


// exports
module.exports = {
  hasOwnKey,
  cloneDeep,
  mergeDeep,
  assignDeep,
  freezeDeep,
  burstArrayDeep,
  createCaseInsensitiveProxy,
};

Object.defineProperty(module.exports, Symbol.for('__TEST__'), {
  value: {
    ...module.exports,
  },
});
