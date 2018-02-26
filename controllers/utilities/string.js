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


/**
 * convert matched context to HTML entity   // note: this method allows `null` or `undefined` argument
 * @param {string} str                      - any arbitrary string
 * @return {string|undefined}               - escaped string, only key HTML entities are escaped
 */
function escapeChars(str) {
    const charMap = {
        '=': '&#61;', "'": '&#39;', '"': '&#34;', '`': '&#96;', '.': '&#46;', ',': '&#44;',
        ':': '&#58;', ';': '&#59;', '<': '&#60;', '(': '&#40;', '[': '&#91;', '{': '&#123;',
    };
    return str === undefined ? undefined : str.replace(/[='"`.,:;<([{]/g, char => charMap[char]);
}


/**
 * parse Mongo ObjectId (hexadecimal)
 * @param {string} str                      - any arbitrary string
 * @return {string}                         - hexadecimal{string}
 */
function readMongoId(str) {
    const output = /(?:\=|\/|^)([a-f\d]{24})(?:\?|\/|$)/i.exec(str);
    if (output === null) throw new TypeError(`No Mongo ObjectId in ${str} can be read.`);
    else return output[1].toLowerCase();
}


/**
 * transpile string to object path array
 * @param {string} str                      - any arbitrary string
 * @return {array}                          - an array contains elements in ordered by nest keys (path)
 */
function readObjPath(str) {
    return str.match(/[a-zA-Z0-9$_]+/g);
}


/**
 * inspect the given file URL
 * @param {string} str                      - any arbitrary string
 * @param {array|*} extName                 - accepted file extension names
 * @param {boolean} [raw=true]              - give the raw result(true) or string(false)
 * @param {string} [use]                    - set the use for the direct output
 * @return {string|array|null}              - direct outputted string or raw result or null
 */
function inspectFileURL(str, extName, { raw = true , use } = {}) {
    const protocolExp   = '(?:(https?):\/\/)';
    const fileNameExp   = `([0-9a-z\\s\\._%-]+\.(?:${extName.join('|')})`;
    const domainExp     = '((?:[0-9a-z%-]+\\.(?!\\.))+[a-z]+)';
    const pathExp       = '(\\/(?:[0-9a-z\\/\\s\\._%-]+\\/)?)';
    const URLExp        = `^${protocolExp}?${domainExp}${pathExp}${fileNameExp}$)`;
    const result        = new RegExp(URLExp, 'i').exec(str);
    const filtrate = Array.isArray(result) ? (use || result[1] || 'https') + '://' + result.slice(2, 5).join('') : null;
    return raw === false ? filtrate : result;
}



// exports
module.exports = { escapeChars, toKebabCase, readMongoId, readObjPath, inspectFileURL };
