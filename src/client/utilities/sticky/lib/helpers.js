/**
 * scale a given value or percentage based on the referenced factor
 * @param value
 * @param factor
 * @return {number}
 */
const normalizeByScaledFactor = (value, factor) => {
  const parse = /^(-?\d+)?(?:.(\d+))?(%|px)?$/.exec(`${value}`.trim()) || {};
  return parse[3] === '%'
    ? ((+`${parse[1] || 0}.${parse[2] || 0}`) / 100) * (factor || 1)
    : +parse[1];
};


/**
 * measure quantity referencing from a given baseline
 * @param num
 * @param [baseline]
 * @return {number}
 */
const normalizeToRelativeNatureNumber = (num, baseline) => {
  return Math.floor(num < 0
    ? baseline > -num
      ? baseline + num
      : 0
    : num);
};


/**
 * measure current scrolling position
 * @return {number}
 */
const getScrollPosition = () => {
  return Math.max(document.documentElement.scrollTop, document.body.scrollTop, window.pageYOffset);
};


/**
 * measure the current dimensions of the view port
 * @return {{height: number, width: number}}
 */
const getDocumentDimensions = () => ({
  height: Math.max(document.documentElement.scrollHeight, window.innerHeight),
  width: Math.max(document.documentElement.clientWidth, window.innerWidth),
});


// exports
module.exports = {
  normalizeByScaledFactor,
  normalizeToRelativeNatureNumber,
  getScrollPosition,
  getDocumentDimensions,
};
