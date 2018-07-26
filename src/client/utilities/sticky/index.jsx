import styled from 'styled-components';
import React, { Component } from 'react';


// modules
import calculate from './lib/calculators';


// component
const StyledStickyBox = styled.div.attrs({
  'data-sticky-active': ({ _active }) => _active,
  'data-sticky-topped': ({ _topped }) => _topped,
  'data-sticky-stuck': ({ _stuck }) => _stuck,
})`
  ${({ _height = '100%', _width = '100%', _top = 'inherit', _stuck, _topped }) => `
    height: ${_height}px;
    width: ${_width}px;
    top: ${_top}px;
  `}
  > * {
    width: inherit;
    top: inherit;
    position: ${({ _stuck }) => (_stuck ? 'fixed' : 'relative')};
    z-index: ${({ _topped }) => (_topped ? 1090 : 'inherit')};
  }
`;


// container
class Sticky extends Component {
  stickyBox = React.createRef();
  eventList = ['resize', 'scroll'];
  state = { styledProp: {}, initialized: false };
  cache = { constants: {}, dimensions: {}, breakpoints: {} };

  _dispatchByDepth = (depth) => {
    // update cache in accordance with the given depth
    const pipeline = [calculate.constants, calculate.dimensions, calculate.breakpoints];
    const reducer = (cache, currentFn) => currentFn(cache, this.props, this.stickyBox.current);
    this.cache = pipeline.slice(depth).reduce(reducer, this.cache);

    // calculate and dispatch the new styledProps
    const styledProp = calculate.styledProps(this.cache);
    this.setState(() => ({ styledProp, initialized: true }));
  };

  _handleStickyEvent = (e) => {
    if (e.type === this.eventList[1]) return this._dispatchByDepth(3);
    return this.setState(() => ({ initialized: false }), () => this._dispatchByDepth(0));
  };

  componentDidMount = () => {
    this._dispatchByDepth(0);
    this.eventList.forEach(event => window.addEventListener(event, this._handleStickyEvent));
  };

  componentWillUnmount = () => {
    this.eventList.forEach(event => window.removeEventListener(event, this._handleStickyEvent));
  };

  render = () => {
    const { styledProp, initialized } = this.state;
    const { children, className } = this.props;
    if (!initialized) {
      return (
        <div ref={this.stickyBox} className={className}>
          {children}
        </div>
      );
    }
    return (
      <StyledStickyBox innerRef={this.stickyBox} className={className} {...styledProp}>
        {children}
      </StyledStickyBox>
    );
  }
}


// exports
export default Sticky;
