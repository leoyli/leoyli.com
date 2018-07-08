import React from 'react';
import classNames from 'classNames';
import { Link, NavLink } from 'react-router-dom';


// style
import $style from './style.scss';


// dependents
import Toggle from '../../widgets/toggle';


// helper
// components
const UserMenu = () => (
  <Toggle>
    {({ hidden, toggle, ref }) => {
      const toggleMenuClassName = classNames({
        '_-dropdown__menu': true,
        '_-dropdown__menu--hidden': hidden,
      });
      //
      return (
        <div className="_-dropdown">
          <div className="_-dropdown__toggle" onClick={toggle}>
            <img alt="user menu" src="/static/media/icon.png" className="_-dropdown__toggle__icon" />
          </div>
          <div className={toggleMenuClassName} ref={ref}>
            <ul className="_-dropdown__menu__box">
              <li className="_-dropdown__menu__item--title">Welcome!</li>
              <li className="_-dropdown__menu__item--divider">&nbsp;</li>
              <li className="_-dropdown__menu__item"><Link to="/blog/new">New Post</Link></li>
              <li className="_-dropdown__menu__item"><Link to="/util/stacks/posts">Posts Management</Link></li>
              <li className="_-dropdown__menu__item--divider">&nbsp;</li>
              <li className="_-dropdown__menu__item"><Link to="/util/settings">Website Settings</Link></li>
              <li className="_-dropdown__menu__item--divider">&nbsp;</li>
              <li className="_-dropdown__menu__item"><Link to="/signout">Sign out</Link></li>
            </ul>
          </div>
        </div>
      );
    }}
  </Toggle>
);

export default UserMenu;
