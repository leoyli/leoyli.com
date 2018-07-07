import React, { Component } from 'react';


// helpers
const stopPropagation = (e) => e.stopPropagation();


// components
class Toggle extends Component {
  eventList = ['click', 'scroll'];
  state = { hidden: this.props.hidden !== undefined ? this.props.hidden : true };
  ref = React.createRef();

  _handleOnClickToggle = (e) => {
    const { hidden } = this.state;
    if (hidden || (e && e.path && !e.path.includes(this.ref.current))) {
      this.eventList.forEach(event => {
        document[hidden ? 'addEventListener' : 'removeEventListener'](event, this._handleOnClickToggle);
      });
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
    return children({ hidden, toggle: this._handleOnClickToggle, refToStopOnClick: this.ref });
  }
}


// exports
export default Toggle;
