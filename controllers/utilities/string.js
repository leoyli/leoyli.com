/* eslint-disable no-bitwise */
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
    .replace(/(-[A-Z])([A-Z][a-z])/g, '$1-$2')                                                                          // handle signal words in CamelCase
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
 * parse Mongo ObjectId (hexadecimal)                                                                                   // todo: option to output ObjectId obj.
 * @param {string} str                      - any arbitrary string
 * @return {object}                         - hexadecimal Mongo `ObjectId` object
 */
const parseMongoObjectId = (str) => {
  const val = !checkToStringTag(str, 'String') || !str ? null : /(?:\=|\/|^)([a-f\d]{24})(?:\?|\/|$)/i.exec(str);
  return val ? ObjectId(val[1].toLowerCase()) : null;
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
 * parse a given file path
 * @param {string} str                      - any arbitrary string
 * @return {object}                         - parsed result
 */
const parsePath = (str) => {
  if (!checkToStringTag(str, 'String') || !str) return null;

  // decode url
  const _decoded = decodeURIComponent(str);
  if (~_decoded.search(/([@#?]|\/\/).*\1/)) return null;

  // extract special components in a url
  const protocol  = _decoded.split('://').reverse()[1];
  const hash      = _decoded.includes('/') && _decoded.split('#')[1];
  const query     = _decoded.includes('/') && _decoded.replace(`#${hash}`, '').split('?')[1];

  // check location
  const _slug     = _decoded.replace(/^\w*:?\/\//, '').replace(`#${hash}`, '').replace(`?${query}`, '').split('/');
  const _host     = _decoded.includes('/') && _slug[0].includes('.') && _slug[0];

  // check port
  const port      = _host && _host.includes(':') && +_host.split(':')[1];
  if (Number.isNaN(port) || port < -1 || port > 65536) return null;

  // check base
  const base      = (_slug[_slug.length - 1] !== _host && _slug[_slug.length - 1]) || '';
  if (~base.search(/[@#?:]/)) return null;

  const username  = _host && _host.split('@').reverse()[1];
  const hostname  = _host && _host.replace(`${username}@`, '').split(':')[0];
  const ext       = base.includes('.') && base.split('.').reverse()[0];
  const dir       = `/${_slug.slice(_slug.indexOf(_host) + 1, _slug.indexOf(base)).join('/')}`.replace('//', '');

  // normalize result
  const result = { input: str, protocol, hostname, username, port, dir, base, ext, query, hash };
  for (let keys = Object.keys(result), i = keys.length - 1; i > -1; i -= 1) result[keys[i]] = result[keys[i]] || null;
  return result;
};


// exports
module.exports = {
  checkToStringTag,
  toKebabCase,
  toCapitalized,
  toEscapedChars,
  parseMongoObjectId,
  parseObjPath,
  parsePath,
};

Object.defineProperty(module.exports, Symbol.for('__TEST__'), {
  value: {
    ...module.exports,
  },
});
