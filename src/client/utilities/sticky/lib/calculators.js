const {
  normalizeByScaledFactor,
  normalizeToRelativeNatureNumber,
  getScrollPosition,
  getDocumentDimensions,
} = require('./helpers');


/**
 * (depth#0) calculate the wrapper div dimensions from the children props
 * @param cache
 * @param props
 * @param ref
 * @return {{dimensions}}}
 */
const calculateDimensions = (cache, props, ref) => {
  const box = { height: ref.offsetHeight, width: ref.offsetWidth };
  const view = getDocumentDimensions();
  return { ...cache, dimensions: { box, view } };
};


/**
 * (depth#1) calculate sticky constants (initializing the component only)
 * @param cache
 * @param props
 * @param ref
 * @return {{constants}}
 */
const calculateConstants = (cache, props, ref) => {
  const { top, bottom, start, stop, distance } = props;
  const { height: pageHeight } = cache.dimensions.view;

  // normalize constants
  const TOP = normalizeByScaledFactor(top, window.innerHeight);
  const BOTTOM = normalizeByScaledFactor(bottom, window.innerHeight);
  const START = normalizeByScaledFactor(start, pageHeight);
  const STOP = normalizeByScaledFactor(stop, pageHeight);
  const DISTANCE = normalizeByScaledFactor(distance, pageHeight);

  return { ...cache, constants: { TOP, BOTTOM, START, STOP, DISTANCE } };
};


/**
 * (depth#2) calculate the breakpoints for the scrolling events
 * @param cache
 * @param props
 * @param ref
 * @return {{breakpoints}}
 */
const calculateBreakpoints = (cache, props, ref) => {
  const { TOP, BOTTOM, START, STOP, DISTANCE } = cache.constants;
  const { box: { height: boxHeight }, view: { height: pageHeight } } = cache.dimensions;
  const viewportHeight = window.innerHeight;

  // calculate breakpoints
  const initial = ref.getBoundingClientRect().top + getScrollPosition();
  const vertex = normalizeToRelativeNatureNumber(TOP)
    || normalizeToRelativeNatureNumber(-BOTTOM, viewportHeight)
    || (initial - normalizeToRelativeNatureNumber(START))
    || (initial ? -initial : 0);
  const adjust = normalizeToRelativeNatureNumber(vertex - initial);
  const active = normalizeToRelativeNatureNumber(START)
    || normalizeToRelativeNatureNumber(initial - vertex) + (initial ? 0 : boxHeight);
  const frozen = normalizeToRelativeNatureNumber(STOP, pageHeight - viewportHeight)
    || ((active || adjust) + (normalizeToRelativeNatureNumber(DISTANCE) || pageHeight));

  return { ...cache, breakpoints: { initial, vertex, adjust, active, frozen } };
};


/**
 * (depth#3) calculated styled props for the styled components
 * @param cache
 * @return {object}
 */
const calculateStickyProps = (cache) => {
  const { initial, vertex, adjust, active, frozen } = cache.breakpoints;
  const { height: _height, width: _width } = cache.dimensions.box;
  const current = getScrollPosition();
  return {
    // control sticky element
    _active: current >= active,
    _topped: current >= active && initial === 0,
    _stuck: current >= active && current <= frozen,

    // defined styling variables
    _height,
    _width,
    _top: current >= active
      ? (current <= frozen) ? vertex : (frozen - active + adjust)
      : undefined,
  };
};


module.exports = {
  constants: calculateConstants,
  dimensions: calculateDimensions,
  breakpoints: calculateBreakpoints,
  stickyProps: calculateStickyProps,
};
