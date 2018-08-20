import styled from 'styled-components';
import React, { PureComponent } from 'react';


// modules
import { getDocumentDimensions } from './lib/helpers';
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
class Sticky extends PureComponent {
  stickyBox = React.createRef();
  eventList = ['resize', 'scroll'];
  cache = { constants: {}, dimensions: {}, breakpoints: {} };
  state = { initialized: false, _active: false, _topped: false, _stuck: false, _height: '', _width: '', _top: '' };

  _updateStickyPropsInDepth = (depth) => {
    // update new cache values
    const pipeline = [calculate.dimensions, calculate.constants, calculate.breakpoints];
    const reducer = (cache, workingFn) => workingFn(cache, this.props, this.stickyBox.current);
    this.cache = pipeline.slice(depth).reduce(reducer, this.cache);

    // update states
    this.setState(() => ({
      initialized: true,
      ...calculate.stickyProps(this.cache),
    }));
  };

  _handleReCalculation = () => {
    const { height: prevVH, width: prevVW } = this.cache.dimensions.view;
    const { height: nextVH, width: nextVW } = getDocumentDimensions();

    // dispatcher
    switch (true) {
      case (prevVW !== nextVW):
        return this.setState(
          () => ({ initialized: false }),
          () => this._updateStickyPropsInDepth(0),
        );
      case (prevVH !== nextVH):
        this.cache.dimensions.view.height = nextVH;
        return this._updateStickyPropsInDepth(1);
      default:
        return this._updateStickyPropsInDepth(3);
    }
  };

  _handleInitialization = () => {
    this._updateStickyPropsInDepth(0);
    this.eventList.forEach(event => window.addEventListener(event, this._handleReCalculation));
  };

  componentDidMount = () => {
    if (document.readyState === 'complete') return this._handleInitialization();
    window.addEventListener('load', this._handleInitialization, { once: true });
  };

  componentWillUnmount = () => {
    this.eventList.forEach(event => window.removeEventListener(event, this._handleReCalculation));
  };

  render = () => {
    const { initialized } = this.state;
    const { children, className } = this.props;
    return initialized
      ? (
        <StyledStickyBox className={className} innerRef={this.stickyBox} {...this.state}>
          {children}
        </StyledStickyBox>
      )
      : (
        <div className={className} ref={this.stickyBox}>
          {children}
        </div>
      );
  }
}


// exports
export default Sticky;
