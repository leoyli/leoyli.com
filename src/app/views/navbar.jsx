import React from 'react';
import { NavLink } from 'react-router-dom';


// dependents
import Sticky from '../controllers/sticky/';
import Dropdown from '../controllers/dropdown/';


// components
const Brand = () => (<NavLink className="navbar-brand mb-0 h1" to="/">SandBox</NavLink>);

const UserMenu = () => (
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
        <NavLink to="/blog"><li className="_-dropdown__menu__item">BLOG</li></NavLink>
        <li className="_-dropdown__menu__item--divider">&nbsp;</li>
        <li className="_-dropdown__menu__item">...</li>
      </ul>
    </div>
  </Dropdown>
);

const NavBar = () => (
  <Sticky>
    <nav className="navbar navbar-expand-lg _-nav">
      <div className="container">
        <Brand />
        <UserMenu />
      </div>
    </nav>
  </Sticky>

);


// exports
export default NavBar;
