/**
 * measure the current dimensions of the view port
 * @return {{height: number, width: number}}
 */
const getDocumentDimensions = () => ({
  height: Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
  ),
  width: Math.max(
    document.body.offsetWidth,
    document.body.clientWidth,
    document.documentElement.offsetWidth,
    document.documentElement.clientWidth,
  ),
});


/**
 * scale a given value or percentage based on the referenced factor
 * @param {string|number} value
 * @param {string|number} factor
 * @return {number}
 */
const normalizeByScaledFactor = (value, factor) => {
  const [input, integer = 0, fraction = 0, unit] = /^([+-]?\d*)?(?:.(\d+))?(%|px)?$/i.exec(`${value}`.trim()) || [];
  if (!input) return NaN;
  return unit === '%'
    ? (`${integer}.${fraction}` / 100) * (factor || 1)
    : +integer;
};


/**
 * transform result by dropping negative
 * @param {function} operator
 * @return {function(*=): number} num >= 0
 */
const transform$NatureNumber = (operator) => (...arg) => {
  const result = operator(...arg);
  return result > 0 ? Math.floor(result) : 0;
};


/**
 * get difference from reference points
 *    ^
 *    |   |
 * ---|--(-)--  ceil
 *    |   |
 * --(+)--|---  base
 *    |   |
 *        v
 * @param {number} num
 * @param {number} [ceil = 0]
 * @param {number} [base = 0]
 * @return {number}
 */
const calcFromRefPts = (num, ceil = 0, base = 0) => {
  return num < 0 ? ceil + num : num - base;
};


/**
 * get difference from reference points and drop negative value
 *    ^
 *    |   |
 * ---|--(-)--  ceil (+)
 *    |   |
 * --(+)--|---  base (+)
 * ---|---x---  0
 *        |     ^
 *        |     |
 *        v     raw (-)
 * @param arg
 * @return {number}
 */
const calcFromRefPtsInNatureNumber = (...arg) => {
  return transform$NatureNumber(calcFromRefPts)(...arg);
};


// exports
module.exports = {
  normalizeByScaledFactor,
  getDocumentDimensions,
  transform$NatureNumber,
  calcFromRefPts,
  calcFromRefPtsInNatureNumber,
};
