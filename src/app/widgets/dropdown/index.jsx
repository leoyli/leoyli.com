import React from 'react';


// styles
import style from './style.scss';


// magic-strings
const NAMESPACE = {
  eventList: ['click', 'scroll'],
  className: {
    leader: '_-dropdown',
    toggle: '_-dropdown__toggle',
    target: '_-dropdown__menu',
    hidden: '_-dropdown__menu--hidden',
  },
};


// components
class Dropdown extends React.Component {
  dropdownBoxClassName = [NAMESPACE.className.leader, this.props.className].join(' ').trim();
  dropdownBox = React.createRef();

  _handleDropdownEvent = (e) => {
    const { className, eventList } = NAMESPACE;
    if (!e.target.className || !e.target.className.toString().includes(className.target)) {
      this.dropdownMenuNode.classList.add(className.hidden);
      eventList.map(type => document.removeEventListener(type, this._handleDropdownEvent));
    }
  };

  _onClickToggleMenu = (e) => {
    const { className, eventList } = NAMESPACE;
    if (e.target.className.toString().includes(className.toggle)
        && !this.dropdownMenuNode.classList.toggle(className.hidden)) {
      eventList.map(type => document.addEventListener(type, this._handleDropdownEvent));
    }
  };

  componentDidMount = () => {
    const { className } = NAMESPACE;
    this.dropdownMenuNode = this.dropdownBox.current.getElementsByClassName(className.target)[0];
    this.dropdownMenuNode.classList.add(className.hidden);
  };

  render = () => (
    <div className={this.dropdownBoxClassName} ref={this.dropdownBox} onClick={this._onClickToggleMenu}>
      {this.props.children}
    </div>
  );
}


// exports
export default Dropdown;
