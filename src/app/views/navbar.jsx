import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';


// dependents
import Sticky from '../controllers/sticky/';
import Dropdown from '../controllers/dropdown/';
import { isSignedIn, onClickSignIn, onClickSignOut } from '../controllers/auth/';


// components
const Brand = () => (<NavLink className="navbar-brand mb-0 h1" to="/">SandBox</NavLink>);

const NavMenuInAuth = () => (
  <Dropdown>
    <div className="_-dropdown__toggle">
      <img
        alt="user menu"
        className="_-dropdown__toggle__icon"
        src="https://localhost:3443/static/media/icon.png"
      />
    </div>
    <div className="_-dropdown__menu _-dropdown__menu_hidden">
      <ul className="_-dropdown__menu__box">
        <li className="_-dropdown__menu__item--title">Hi ...!</li>
        <li className="_-dropdown__menu__item--divider">&nbsp;</li>
        <li className="_-dropdown__menu__item"><NavLink to="/blog">BLOG</NavLink></li>
        <li className="_-dropdown__menu__item--divider">&nbsp;</li>
        <li className="_-dropdown__menu__item"><NavLink to="/" onClick={onClickSignOut}>Sign out</NavLink></li>
      </ul>
    </div>
  </Dropdown>
);

class NavBar extends Component {
  state = { isSignedIn: false };

  _checkAuthenticationState = () => isSignedIn() && this.setState(() => ({ isSignedIn: true }));

  componentDidMount() {
    this._checkAuthenticationState();
  }

  render() {
    return (
      <Sticky>
        <nav className="navbar navbar-expand-lg _-nav">
          <div className="container">
            <Brand />
            {(this.state.isSignedIn) ? (<NavMenuInAuth />) : (<button onClick={onClickSignIn}>Sign in</button>)}
          </div>
        </nav>
      </Sticky>
    );
  }
}


// exports
export default NavBar;
