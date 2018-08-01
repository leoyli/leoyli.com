/* global __isBrowser__ */

import React from 'react';
import { Link, NavLink } from 'react-router-dom';


// modules
import { AuthState, WebConfig } from '../../utilities/contexts';
import Sticky from '../../utilities/sticky';
import SearchBar from '../searchbar';
import UserMenu from '../usermenu';
import $style from './style.scss';


// components
const SignInButton = () => (
  <button type="button" className="btn mx-2 _-button--signin">
    <Link to={{ state: { returnTo: (__isBrowser__ && window.location.pathname) || '/' }, pathname: '/signin' }}>
      Sign in
    </Link>
  </button>
);

const NavLeftPort = () => {
  const navLinkSharedProps = {
    className: '_-nav__link d-none d-sm-inline',
    activeClassName: '_-nav__link--active',
  };
  const isOnBlog = (match, location) => {
    return location.pathname.includes('/blog')
      && !['/blog/about', '/blog/cv'].includes(location.pathname.toLowerCase());
  };

  return (
    <WebConfig.Consumer>
      {({ general: { siteName } }) => (
        <div className="_-nav__left-menu">
          <Link to="/" className="navbar-brand mb-0 h1">
            {siteName}
          </Link>
          <NavLink {...navLinkSharedProps} exact to="/blog/about">
            About
          </NavLink>
          <NavLink {...navLinkSharedProps} exact to="/blog/CV">
            CV
          </NavLink>
          <NavLink {...navLinkSharedProps} isActive={isOnBlog} to="/blog">
            Blog
          </NavLink>
        </div>
      )}
    </WebConfig.Consumer>
  );
};

const NavRightPort = () => (
  <AuthState.Consumer>
    {({ isSignedIn }) => (
      <div className="_-nav__right-menu">
        <SearchBar />
        {(isSignedIn) ? (<UserMenu />) : (<SignInButton />)}
      </div>
    )}
  </AuthState.Consumer>
);

const Navbar = () => (
  <Sticky>
    <nav className="navbar navbar-expand-lg _-nav">
      <div className="container">
        <NavLeftPort />
        <NavRightPort />
      </div>
    </nav>
  </Sticky>
);


// exports
export default Navbar;
