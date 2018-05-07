const { ObjectId } = require('mongodb');


/**
 * check the object type via `Object.prototype.toString`
 * @param {object} target                   - object to be checked
 * @param {string} [str]                    - name to be matched (case insensitive)
 * @return {(boolean|string)}               - if no name given, the brand name of the object would be returned
 */
const checkToStringTag = (target, str) => {
  const name = (obj) => Object.prototype.toString.call(obj).slice(8, -1);
  if (str && name(str).toLowerCase() !== 'string') throw new TypeError('Second argument is not a string.');
  if (str) return name(target).toLowerCase() === str.toLowerCase();
  return name(target);
};


/**
 * convert string to kebabCase
 * @param {string} str                      - any arbitrary string
 * @return {string}                         - kebabCased string
 */
const toKebabCase = (str) => {
  return !checkToStringTag(str, 'String') || !str ? null : str
    .replace(/([a-z])([A-Z])/g, '$1-$2')                                                                                // handle CamelCase
    .replace(/[`'":;,.?!@#$%^&*_=~(){}<>/\\\[\]\-\+\|\s]+/g, '-')                                                       // normalize special characters
    .replace(/(-[A-Z])([A-Z][a-z])/g, '$1-$2')                                                                         // handle signal words in CamelCase
    .replace(/^-+|-+$/g, '')                                                                                            // cleanup endpoints
    .toLowerCase();
};


/**
 * capitalize each words of a string
 * @param {string} str                      - any arbitrary string
 * @return {string}                         - capitalized string
 */
const toCapitalized = (str) => {
  return !checkToStringTag(str, 'String') || !str  ? null : str.split(' ')
    .map(subStr => subStr.charAt(0).toUpperCase() + subStr.slice(1)).join(' ');
};


/**
 * convert matched context to HTML entity                                                                               // note: this method allows `null` or `undefined` argument
 * @param {string} str                      - any arbitrary string
 * @return {string|undefined}               - escaped string, only key HTML entities are escaped
 */
const toEscapedChars = (str) => {
  const charMap = {
    '=': '&#61;',
    "'": '&#39;',
    '"': '&#34;',
    '`': '&#96;',
    '.': '&#46;',
    ',': '&#44;',
    ':': '&#58;',
    ';': '&#59;',
    '<': '&#60;',
    '(': '&#40;',
    '[': '&#91;',
    '{': '&#123;',
  };
  return !checkToStringTag(str, 'String') || !str  ? null : str.replace(/[='"`.,:;<([{]/g, char => charMap[char]);
};


/**
 * parse a string to object path array
 * @param {string} str                      - any arbitrary string
 * @return {array}                          - an array contains elements in ordered by nest keys (path)
 */
const parseObjPath = (str) => {
  return !checkToStringTag(str, 'String') || !str  ? null : str.match(/[a-zA-Z0-9$_]+/g);
};


/**
 * parse Mongo ObjectId (hexadecimal)                                                                                   // todo: option to output ObjectId obj.
 * @param {string} str                      - any arbitrary string
 * @return {object}                         - hexadecimal Mongo `ObjectId` object
 */
const parseMongoObjectId = (str) => {
  const val = !checkToStringTag(str, 'String') || !str ? null : /(?:\=|\/|^)([a-f\d]{24})(?:\?|\/|$)/i.exec(str);
  return val ? ObjectId(val[1].toLowerCase()) : null;
};


/**
 * parse a given file path
 * @param {string} str                      - any arbitrary string
 * @return {object}                         - parsed result
 */
const parseFilePath = (str) => {
  if (!checkToStringTag(str, 'String') || !str) return null;
  const protocol = str.split('://').reverse()[1] || null;
  const hash = str.split('#')[1] || null;
  const query = str.replace(`#${hash}`, '').split('?')[1] || null;

  // check and handle the rest of path
  const location = str.replace(/^\w*:?\/\//, '').replace(`#${hash}`, '').replace(`?${query}`, '');
  if (location.includes('//')) return null;

  const _split = location.split('/');
  const hostname = _split.find(frag => frag.includes('.')) || null;
  const filename = (_split[_split.length - 1] !== hostname && _split[_split.length - 1]) || null;
  const extension = (filename && filename.split('.')[1]) || null;
  const path = `/${_split.slice(
    _split.indexOf(hostname) + 1,
    _split.indexOf(filename),
  ).join('/')}/`.replace('//', '') || null;

  // return parsed result
  return { input: str, protocol, hostname, path, filename, extension, query, hash };
};


// exports
module.exports = {
  checkToStringTag,
  toKebabCase,
  toCapitalized,
  toEscapedChars,
  parseMongoObjectId,
  parseObjPath,
  parseFilePath,
};
