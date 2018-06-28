/* global __isBrowser__ */

import React from 'react';
import { Link, NavLink } from 'react-router-dom';


// dependents
import Dropdown from '../widgets/dropdown/';
import SearchBar from '../widgets/searchbar/';
import Sticky from '../widgets/sticky/';


// helper
// components
const NavMenuAuthOff = () => {
  const state = { returnTo: (__isBrowser__ && window.location.pathname) || '/' };
  return (
    <button className="btn mt-1 ml-2 _-button--signin">
      <Link to={{ state, pathname: '/signin' }}>Sign in</Link>
    </button>
  );
};

const NavMenuAuthOn = () => (
  <Dropdown>
    <div className="_-dropdown__toggle">
      <img
        alt="user menu"
        className="_-dropdown__toggle__icon"
        src="/static/media/icon.png"
      />
    </div>
    <div className="_-dropdown__menu _-dropdown__menu--hidden">
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
  </Dropdown>
);

const NavLeftPort = ({ siteName }) => (
  <div className="_-nav__left-menu">
    <Link
      to="/"
      className="navbar-brand mb-0 h1"
    >{siteName}
    </Link>
    <NavLink
      exact
      to="/blog/about"
      className="_-nav__link"
      activeClassName="_-nav__link--active"
    >About
    </NavLink>
    <NavLink
      to="/blog"
      className="_-nav__link"
      activeClassName="_-nav__link--active"
      isActive={(match, location) => location.pathname.includes('/blog') && !location.pathname.includes('/blog/about')}
    >Blog
    </NavLink>
  </div>
);

const NavRightPort = ({ isSignedIn }) => (
  <div className="_-nav__right-menu">
    <SearchBar />
    {(isSignedIn) ? (<NavMenuAuthOn />) : (<NavMenuAuthOff />)}
  </div>
);

const NavBar = ({ isSignedIn, _$CONFIG }) => (
  <Sticky>
    <nav className="navbar navbar-expand-lg _-nav">
      <div className="container">
        <NavLeftPort siteName={_$CONFIG.siteName} />
        <NavRightPort isSignedIn={isSignedIn} />
      </div>
    </nav>
  </Sticky>
);


// exports
export default NavBar;
