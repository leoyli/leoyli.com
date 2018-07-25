import styled from 'styled-components';
import React, { Component } from 'react';


// modules
import { measureCurrentViewPort } from './lib/helpers';
import calculate from './lib/calculators';


// component
const StyledStickyBox = styled.div.attrs({
  'data-sticky': ({ _sticky }) => _sticky,
  'data-sticky-topped': ({ _topped }) => _topped,
})`
  ${({ _height = '100%', _width = '100%', _top = 'inherit' }) => `
    height: ${_height}px;
    width: ${_width}px;
    top: ${_top}px;
  `}
  > * {
    width: inherit;
    top: inherit;
    position: ${({ _sticky }) => (_sticky ? 'fixed' : 'relative')};
    z-index: ${({ _topped }) => (_topped ? 1090 : 'inherit')};
  }
`;


// container
class Sticky extends Component {
  stickyBox = React.createRef();
  eventList = ['resize', 'scroll'];
  state = { styledProp: {} };
  cache = { constants: {}, dimensions: {}, breakpoints: {} };

  dispatchByDepth = (depth) => {
    // update cache in accordance with the given depth
    const pipeline = [calculate.constants, calculate.dimensions, calculate.breakpoints];
    const reducer = (cache, currentFn) => currentFn(cache, this.props, this.stickyBox.current);
    this.cache = pipeline.slice(depth).reduce(reducer, this.cache);

    // calculate and dispatch the new styledProps
    const styledProp = calculate.styledProps(this.cache);
    this.setState(() => ({ styledProp }));
  };

  _handleStickyEvent = () => {
    const { height: currentHeight, width: currentWidth } = measureCurrentViewPort();
    const { height: cachedHeight, width: cachedWidth } = this.cache.dimensions.view;
    if (cachedWidth !== currentWidth) return this.dispatchByDepth(1);
    if (cachedHeight !== currentHeight) return this.dispatchByDepth(2);
    return this.dispatchByDepth(3);
  };

  componentDidMount = () => {
    this.dispatchByDepth(0);
    this.eventList.forEach(event => window.addEventListener(event, this._handleStickyEvent));
  };

  componentWillUnmount = () => {
    this.eventList.forEach(event => window.removeEventListener(event, this._handleStickyEvent));
  };

  render = () => {
    const { styledProp } = this.state;
    const { children, className } = this.props;
    return (
      <StyledStickyBox innerRef={this.stickyBox} className={className} {...styledProp}>
        {children}
      </StyledStickyBox>
    );
  }
}


// exports
export default Sticky;
