import React from 'react';


// style
import $style from './style.scss';


// namespaces
const NAMESPACE = {
  eventList: ['resize', 'scroll'],
  className: {
    leader: '_-sticky',
    topped: '_-sticky--topped',
    active: '_-sticky--active',
    hauled: '_-sticky--hauled',
  },
};


// helpers
const getNormalizedConstant = (value, normalizationFactor) => {
  const parse = /^(-?\d+)?(?:.(\d+))?(%|px)?$/.exec(`${value}`.trim()) || {};
  return parse[3] === '%'
    ? ((+`${parse[1] || 0}.${parse[2] || 0}`) / 100) * (normalizationFactor || 1)
    : +parse[1];
};

const getQuantityUponBaseline = (num, baseline) => {
  return Math.floor(num < 0
    ? baseline > -num
      ? baseline + num
      : 0
    : num);
};

const scrollPosition = () => {
  return Math.max(document.documentElement.scrollTop, document.body.scrollTop, window.pageYOffset);
};

const measureCurrentViewPort = () => ({
  height: Math.max(document.documentElement.scrollHeight, window.innerHeight),
  width: Math.max(document.documentElement.clientWidth, window.innerWidth),
});


// components
class Sticky extends React.Component {
  stickyBox = React.createRef();
  state = { className: '', style: {} };
  cache = { constants: {}, positions: {}, dimensions: {} };

  _calculateConstants = () => {
    const { top, bottom, start, stop, distance } = this.props;

    // perform calculations
    const TOP = getNormalizedConstant(top, window.innerHeight);
    const BOTTOM = getNormalizedConstant(bottom, window.innerHeight);
    const START = getNormalizedConstant(start, document.documentElement.scrollHeight);
    const STOP = getNormalizedConstant(stop, document.documentElement.scrollHeight);
    const DISTANCE = getNormalizedConstant(distance, document.documentElement.scrollHeight);

    // cache calculations
    this.cache.constants = { TOP, BOTTOM, START, STOP, DISTANCE };
    return this;
  };

  _calculateVariables = () => {
    const { TOP, BOTTOM, START, STOP, DISTANCE } = this.cache.constants;

    // calculate positions
    const initial = this.stickyBox.current.getBoundingClientRect().top + scrollPosition();
    const vertex = getQuantityUponBaseline(TOP)
      || getQuantityUponBaseline(-BOTTOM, window.innerHeight)
      || getQuantityUponBaseline(START - initial)
      || (initial ? -initial : 0);
    const active = getQuantityUponBaseline(initial - vertex) + (initial ? 0 : this.stickyBox.current.offsetHeight);
    const frozen = getQuantityUponBaseline(STOP, document.documentElement.scrollHeight)
      || (active + (getQuantityUponBaseline(DISTANCE) || document.documentElement.scrollHeight));

    // cache calculations
    this.cache.positions = { initial, vertex, active, frozen };
    return this;
  };

  _calculateDimensions = () => {
    // relax the box
    const stickyBoxDOM = this.stickyBox.current;
    const [name, height, width] = [stickyBoxDOM.className, stickyBoxDOM.style.height, stickyBoxDOM.style.width];
    stickyBoxDOM.className = this.props.className;
    stickyBoxDOM.style.height = '';
    stickyBoxDOM.style.width = '';

    // calculate and cache dimensions
    const box = { height: stickyBoxDOM.offsetHeight, width: stickyBoxDOM.offsetWidth };
    const view = measureCurrentViewPort();
    this.cache.dimensions = { box, view };

    // contract the box
    [stickyBoxDOM.className, stickyBoxDOM.style.height, stickyBoxDOM.style.width] = [name, height, width];
    return this;
  };

  _updateStickyBox = () => {
    const { className } = NAMESPACE;
    const { initial, vertex, active, frozen } = this.cache.positions;
    const current = scrollPosition();

    // control sticky element
    const classList = [this.props.className, className.leader];
    if (current > active) classList.push(className.hauled);
    if (current > active && initial === 0) classList.push(className.topped);
    if (current > active && current < frozen) classList.push(className.active);

    const style = {
      height: `${this.cache.dimensions.box.height}px`,
      width: `${this.cache.dimensions.box.width}px`,
      top: current > active ? `${(current < frozen) ? vertex : (frozen - active)}px` : '',
    };

    this.setState(() => ({ className: classList.join(' '), style }));
    return this;
  };

  _handleStickyEvent = () => {
    const { height: currentHeight, width: currentWidth } = measureCurrentViewPort();
    const { height: cachedHeight, width: cachedWidth } = this.cache.dimensions.view;
    if (cachedWidth !== currentWidth) return this._calculateDimensions()._calculateVariables()._updateStickyBox();
    if (cachedHeight !== currentHeight) return this._calculateVariables()._updateStickyBox();
    return this._updateStickyBox();
  };

  componentDidMount = () => {
    this._calculateConstants()._calculateDimensions()._calculateVariables()._updateStickyBox();
    NAMESPACE.eventList.forEach(event => window.addEventListener(event, this._handleStickyEvent));
  };

  componentWillUnmount = () => {
    NAMESPACE.eventList.forEach(event => window.removeEventListener(event, this._handleStickyEvent));
  };

  render = () => {
    const {
      state: { className, style },
      props: { children },
    } = this;
    return (
      <div ref={this.stickyBox} className={className} style={style}>
        {children}
      </div>
    );
  }
}


// exports
export default Sticky;
