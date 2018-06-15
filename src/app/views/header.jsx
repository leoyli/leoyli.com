import React from 'react';


// components
const Header = ({ title, subtitle }) => (
  <header className="_-section__header d-flex mb-5">
    <div className="container align-self-end">
      <h2>{title}{subtitle && ` - ${subtitle.replace(/\b\w/g, l => l.toUpperCase())}`}</h2>
      <TabBar />
    </div>
  </header>
);

const TabBar = () => (
  <div className="_-tabbar">&nbsp;</div>
);


// exports
export default Header;
