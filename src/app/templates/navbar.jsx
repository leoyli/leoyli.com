/* global __isBrowser__ */

import React from 'react';
import { Link, NavLink } from 'react-router-dom';


// dependents
import UserMenu from './usermenu';
import SearchBar from '../widgets/searchbar';
import Sticky from '../widgets/sticky';


// components
const SignInButton = () => {
  const state = { returnTo: (__isBrowser__ && window.location.pathname) || '/' };
  return (
    <button className="btn mt-1 ml-2 _-button--signin">
      <Link to={{ state, pathname: '/signin' }}>Sign in</Link>
    </button>
  );
};

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
      className="_-nav__link d-none d-sm-inline"
      activeClassName="_-nav__link--active"
    >About
    </NavLink>
    <NavLink
      exact
      to="/blog/CV"
      className="_-nav__link d-none d-sm-inline"
      activeClassName="_-nav__link--active"
    >CV
    </NavLink>
    <NavLink
      to="/blog"
      className="_-nav__link d-none d-sm-inline"
      activeClassName="_-nav__link--active"
      isActive={(match, location) => {
        return location.pathname.includes('/blog')
          && !['/blog/about', '/blog/cv'].includes(location.pathname.toLowerCase());
      }}
    >Blog
    </NavLink>
  </div>
);

const NavRightPort = ({ isSignedIn }) => (
  <div className="_-nav__right-menu">
    <SearchBar />
    {(isSignedIn) ? (<UserMenu />) : (<SignInButton />)}
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
