import React from 'react';


// style
import style from './style.scss';


// magic-strings
const NAMESPACE = {
  eventList: ['resize', 'scroll'],
  className: {
    leader: '_-sticky',
    navbar: '_-sticky_navbar',
    active: '_-sticky_active',
    hauled: '_-sticky_hauled',
  },
};


// helpers
const getScaledValue = function getScaledValue(value, scaleFactor) {
  const parse = /^(-?\d+)?(?:.(\d+))?(%|px)?$/.exec(`${value}`.trim()) || {};
  return parse[3] === '%'
    ? ((+`${parse[1] || 0}.${parse[2] || 0}`) / 100) * (scaleFactor || 1)
    : +parse[1];
};

const getQuantityUponBaseline = function getQuantityUponBaseline(num, baseline) {
  return Math.floor(num < 0
    ? baseline > -num
      ? baseline + num
      : 0
    : num);
};

const scrollPosition = function scrollPosition() {
  return Math.max(document.documentElement.scrollTop, document.body.scrollTop, window.pageYOffset);
};


// components
class Sticky extends React.Component {
  stickyBoxClassNames = [NAMESPACE.className.leader, this.props.className].join(' ').trim();
  stickyBox = React.createRef();

  _loadConfigs = () => {
    this.stickyBoxNode = this.stickyBox.current;
    this.stickyConfigs = {
      $TOP: getScaledValue(this.props.top, window.innerHeight),
      $BOTTOM: getScaledValue(this.props.bottom, window.innerHeight),
      $START: getScaledValue(this.props.start, document.documentElement.scrollHeight),
      $STOP: getScaledValue(this.props.stop, document.documentElement.scrollHeight),
      $DISTANCE: getScaledValue(this.props.distance, document.documentElement.scrollHeight),
    };
    return this;
  };

  _updateStickyBox = () => {
    this.stickyBoxNode.style.height = this.stickyBoxNode.style.width = '';
    this.stickyBoxNode.style.height = `${this.stickyBoxNode.offsetHeight}px`;
    this.stickyBoxNode.style.width  = `${this.stickyBoxNode.offsetWidth}px`;
    return this;
  };

  _calculatePositions = () => {
    const { $TOP, $BOTTOM, $START, $STOP, $DISTANCE } = this.stickyConfigs;

    // calculating positions
    const initial = this.stickyBoxNode.getBoundingClientRect().top + scrollPosition();
    const vertex = getQuantityUponBaseline($TOP)                                                                        // by $TOP
      || getQuantityUponBaseline(-$BOTTOM, window.innerHeight)                                                          // by $BOTTOM
      || getQuantityUponBaseline($START - initial)                                                                      // by $START
      || (initial ? -initial : 0);                                                                                      // (default, non-sticky)
    const active = getQuantityUponBaseline(initial - vertex) + (initial ? 0 : this.stickyBoxNode.offsetHeight);
    const frozen = getQuantityUponBaseline($STOP, document.documentElement.scrollHeight)                                // by $STOP
      || (active + (getQuantityUponBaseline($DISTANCE) || document.documentElement.scrollHeight));                      // by $DISTANCE (default, endless)

    // exposing the results
    this.stickyPositions = { initial, vertex, active, frozen };

    return this;
  };

  _updateStickyElement = () => {
    const { className } = NAMESPACE;
    const { initial, vertex, active, frozen } = this.stickyPositions;
    const current = scrollPosition();

    // assigning classNames
    if (active < current && initial === 0) this.stickyBoxNode.classList.add(className.navbar);
    if (active < current) this.stickyBoxNode.classList.add(className.active, className.hauled);
    if (active >= current) {
      this.stickyBoxNode.classList.remove(className.active, className.hauled, className.navbar);
      this.stickyBoxNode.style.top = '';
    } else if (active < current && current <= frozen) {
      this.stickyBoxNode.style.top = `${vertex}px`;
    } else {
      this.stickyBoxNode.classList.remove(className.active);
      this.stickyBoxNode.style.top = `${frozen - active}px`;
    }

    return this;
  };

  _handleStickyEvent = (e) => {
    if (e.type === 'resize') this._updateStickyBox()._calculatePositions()._updateStickyElement();
    if (e.type === 'scroll') this._updateStickyElement();
  };

  componentDidMount = () => {
    const { eventList } = NAMESPACE;
    this._loadConfigs()._updateStickyBox()._calculatePositions()._updateStickyElement();
    eventList.map(type => window.addEventListener(type, this._handleStickyEvent));
  };

  componentWillUnmount = () => {
    const { eventList } = NAMESPACE;
    eventList.map(type => window.removeEventListener(type, this._handleStickyEvent));
  };

  render = () => (<div className={this.stickyBoxClassNames} ref={this.stickyBox}>{this.props.children}</div>);
}


// exports
export default Sticky;
