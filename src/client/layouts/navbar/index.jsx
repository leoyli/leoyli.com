/* global __isBrowser__ */

import styled from 'styled-components';
import React, { Fragment } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Button, Container, Menu, Responsive } from 'semantic-ui-react';


// modules
import { AuthState, WebConfig } from '../../utilities/contexts';
import Sticky from '../../utilities/sticky';
import SearchBar from './search-bar';
import UserMenu from './user-menu';


// style
const StyledNavBar = styled.nav`
  background: #232a3d;
  color: white;
  padding-bottom: .5rem;
  width: 100vw !important;
  
  & .secondary.menu.container > .right.item {
    height: 3.5rem;
  }
  
  & .header.item {
    font-size: 1.3rem;
    font-weight: 600 !important;
    margin-right: 2rem !important;
    padding: .75rem !important;
  }
  
  & .responsive.mobile {
    display: inherit;
  }

  & .disabled.item + .divider {
    margin-top: 0;
  }

  & #sign-in-button {
    font-weight: 500;
    top: .3rem;
  }
`;


// components
const NavSignInButton = () => (
  <Button
    inverted
    compact
    floated="right"
    id="sign-in-button"
    content="SIGN IN"
    as={Link}
    to={{ state: { returnTo: (__isBrowser__ && window.location.pathname) || '/' }, pathname: '/signin' }}
  />
);

const NavMenuRight = () => (
  <AuthState.Consumer>
    {({ isSignedIn }) => (
      <Menu.Item position="right">
        <SearchBar />
        {isSignedIn ? (<UserMenu />) : (<NavSignInButton />)}
      </Menu.Item>
    )}
  </AuthState.Consumer>
);

const NavMenuLeft = () => (
  <WebConfig.Consumer>
    {({ general: { siteName } }) => (
      <Menu.Menu position="left">
        <Fragment>
          <Menu.Item header content={siteName} as={Link} to="/" />
          <Responsive minWidth={768} className="responsive mobile">
            <Menu.Item content="ABOUT" as={NavLink} exact to="/blog/about" />
            <Menu.Item content="CV" as={NavLink} exact to="/blog/CV" />
            <Menu.Item
              content="BLOG"
              as={NavLink}
              to="/blog"
              isActive={(match, location) => {
                return location.pathname.includes('/blog')
                  && !['/blog/about', '/blog/cv'].includes(location.pathname.toLowerCase());
              }}
            />
          </Responsive>
        </Fragment>
      </Menu.Menu>
    )}
  </WebConfig.Consumer>
);


// view
const NavBar = () => (
  <Sticky>
    <StyledNavBar>
      <Menu inverted secondary pointing as={Container}>
        <NavMenuLeft />
        <NavMenuRight />
      </Menu>
    </StyledNavBar>
  </Sticky>
);


// exports
export default NavBar;
