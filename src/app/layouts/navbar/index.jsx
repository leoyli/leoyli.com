/* global __isBrowser__ */

import React from 'react';
import { Link, NavLink } from 'react-router-dom';


// modules
import Sticky from '../../utilities/sticky';
import SearchBar from '../searchbar';
import UserMenu from '../usermenu';
import $style from './style.scss';


// components
const SignInButton = () => (
  <button type="button" className="btn mt-1 ml-2 _-button--signin">
    <Link to={{ state: { returnTo: (__isBrowser__ && window.location.pathname) || '/' }, pathname: '/signin' }}>
      Sign in
    </Link>
  </button>
);

const NavLeftPort = ({ siteName }) => {
  const className = '_-nav__link d-none d-sm-inline';
  const activeClassName = '_-nav__link--active';
  const option = { className, activeClassName };
  const isOnBlog = (match, location) => {
    return location.pathname.includes('/blog')
      && !['/blog/about', '/blog/cv'].includes(location.pathname.toLowerCase());
  };

  return (
    <div className="_-nav__left-menu">
      <Link to="/" className="navbar-brand mb-0 h1">
        {siteName}
      </Link>
      <NavLink {...option} exact to="/blog/about">
        About
      </NavLink>
      <NavLink {...option} exact to="/blog/CV">
        CV
      </NavLink>
      <NavLink {...option} isActive={isOnBlog} to="/blog">
        Blog
      </NavLink>
    </div>
  );
};

const NavRightPort = ({ isSignedIn }) => (
  <div className="_-nav__right-menu">
    <SearchBar />
    {(isSignedIn) ? (<UserMenu />) : (<SignInButton />)}
  </div>
);

const Navbar = ({ isSignedIn, _$CONFIG }) => (
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
export default Navbar;
