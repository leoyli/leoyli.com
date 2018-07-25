const {
  getScaledValueByFactor,
  getQuantityUponBaseline,
  scrollPosition,
  measureCurrentViewPort,
} = require('./helpers');


/**
 * (depth#0) calculate sticky constants (initializing the component only)
 * @param cache
 * @param props
 * @param ref
 * @return {{constants}}
 */
const calculateConstants = (cache, props, ref) => {
  const { top, bottom, start, stop, distance } = props;
  const TOP = getScaledValueByFactor(top, window.innerHeight);
  const BOTTOM = getScaledValueByFactor(bottom, window.innerHeight);
  const START = getScaledValueByFactor(start, document.documentElement.scrollHeight);
  const STOP = getScaledValueByFactor(stop, document.documentElement.scrollHeight);
  const DISTANCE = getScaledValueByFactor(distance, document.documentElement.scrollHeight);
  return { ...cache, constants: { TOP, BOTTOM, START, STOP, DISTANCE } };
};


/**
 * (depth#1) calculate the wrapper div dimensions from the children props
 * note: this function may cause DOM reflow
 * @param cache
 * @param props
 * @param ref
 * @return {{dimensions}}}
 */
const calculateDimensions = (cache, props, ref) => {
  const { className: propsClassName } = props;
  const { className: refClassName } = ref;

  // reflow layout because recalculation is needed (*)
  if (propsClassName !== refClassName) ref.className = propsClassName;

  // extract the recalculated results
  const box = { height: ref.offsetHeight, width: ref.offsetWidth };
  const view = measureCurrentViewPort();

  return { ...cache, dimensions: { box, view } };
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
  const initial = ref.getBoundingClientRect().top + scrollPosition();
  const vertex = getQuantityUponBaseline(TOP)
    || getQuantityUponBaseline(-BOTTOM, window.innerHeight)
    || getQuantityUponBaseline(START - initial)
    || (initial ? -initial : 0);
  const adjust = getQuantityUponBaseline(vertex - initial);
  const active = getQuantityUponBaseline(initial - vertex) + (initial ? 0 : ref.offsetHeight);
  const frozen = getQuantityUponBaseline(STOP, document.documentElement.scrollHeight)
    || ((active || adjust) + (getQuantityUponBaseline(DISTANCE) || document.documentElement.scrollHeight));
  return { ...cache, breakpoints: { initial, vertex, adjust, active, frozen } };
};


/**
 * (depth#3) calculated styled props for the styled components
 * @param cache
 * @return {styledProps}
 */
const calculateStyledProps = (cache) => {
  const { initial, vertex, adjust, active, frozen } = cache.breakpoints;
  const { height: _height, width: _width } = cache.dimensions.box;
  const current = scrollPosition();
  return {
    // control sticky element
    _active: current >= active,
    _topped: current >= active && initial === 0,
    _sticky: current >= active && current <= frozen,

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
  styledProps: calculateStyledProps,
};
