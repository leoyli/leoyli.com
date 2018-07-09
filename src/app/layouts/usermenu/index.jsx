import React from 'react';
import classNames from 'classNames';
import { Link, NavLink } from 'react-router-dom';


// modules
import Toggle from '../../utilities/toggle';
import $style from './style.scss';


// helper
// components
const UserMenu = () => (
  <Toggle>
    {({ controller, monitored, isHidden }) => {
      const toggleMenuClassName = classNames({
        '_-user_menu__container': true,
        '_-user_menu__container--hidden': isHidden,
      });
      return (
        <div className="_-user_menu">
          <div role="menu" className="_-user_menu__toggle" onClick={controller}>
            <img alt="user menu" src="/static/media/icon.png" className="_-user_menu__toggle__icon" />
          </div>
          <div className={toggleMenuClassName} ref={monitored}>
            <ul className="_-user_menu__list">
              <li className="_-user_menu__item--title">Welcome!</li>
              <li className="_-user_menu__item--divider">&nbsp;</li>
              <li className="_-user_menu__item"><Link to="/blog/new">New Post</Link></li>
              <li className="_-user_menu__item"><Link to="/util/stacks/posts">Posts Management</Link></li>
              <li className="_-user_menu__item--divider">&nbsp;</li>
              <li className="_-user_menu__item"><Link to="/util/settings">Website Settings</Link></li>
              <li className="_-user_menu__item--divider">&nbsp;</li>
              <li className="_-user_menu__item"><Link to="/signout">Sign out</Link></li>
            </ul>
          </div>
        </div>
      );
    }}
  </Toggle>
);

export default UserMenu;
