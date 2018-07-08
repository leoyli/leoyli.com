import React, { Component } from 'react';


// helpers
const stopPropagation = (e) => e.stopPropagation();


// components
class Toggle extends Component {
  state = { hidden: this.props.hidden !== undefined ? this.props.hidden : true };
  eventList = ['click', 'scroll'];
  toggledTarget = React.createRef();

  _handleOnClickToggle = (e) => {
    const { hidden } = this.state;
    //
    if (hidden || (e && e.path && !e.path.includes(this.toggledTarget.current))) {
      const eventListenerToggle = hidden ? 'addEventListener' : 'removeEventListener';
      this.eventList.forEach(event => document[eventListenerToggle](event, this._handleOnClickToggle));
      this.setState(() => ({ hidden: !hidden }));
    }
  };

  componentDidMount = () => {
    const { hidden } = this.state;
    //
    if (!hidden) this.eventList.forEach(event => document.addEventListener(event, this._handleOnClickToggle));
  };

  componentWillUnmount = () => {
    this.eventList.forEach(event => document.removeEventListener(event, this._handleOnClickToggle));
  };

  render = () => {
    const {
      toggledTarget,
      state: { hidden },
      props: { children },
    } = this;
    //
    return children({ toggledTarget, hidden, toggle: this._handleOnClickToggle });
  }
}


// exports
export default Toggle;
