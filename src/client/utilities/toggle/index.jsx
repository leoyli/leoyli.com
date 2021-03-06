import React, { Component } from 'react';


// components
class Toggle extends Component {
  state = { hidden: this.props.hidden !== undefined ? this.props.hidden : true };
  eventList = ['click', 'scroll', 'keyup', 'touchmove'];
  toggledTarget = React.createRef();

  _handleOnClickToggle = (e) => {
    const { hidden } = this.state;
    const { current } = this.toggledTarget;
    if (hidden
      || (current && !current.contains(e.target))
      || (e.keyCode === 27)
    ) {
      const eventListenerToggle = hidden ? 'addEventListener' : 'removeEventListener';
      this.eventList.forEach(event => document[eventListenerToggle](event, this._handleOnClickToggle));
      this.setState(() => ({ hidden: !hidden }));
    }
  };

  componentDidMount = () => {
    const { hidden } = this.state;
    if (!hidden) this.eventList.forEach(event => document.addEventListener(event, this._handleOnClickToggle));
  };

  componentWillUnmount = () => {
    this.eventList.forEach(event => document.removeEventListener(event, this._handleOnClickToggle));
  };

  render = () => {
    const { hidden } = this.state;
    const { children } = this.props;
    return children({ controller: this._handleOnClickToggle, monitored: this.toggledTarget, isHidden: hidden });
  }
}


// exports
export default Toggle;
