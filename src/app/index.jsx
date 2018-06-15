import React, { Component } from 'react';


// routing
import { Switch, Route } from 'react-router-dom';
import { routers } from './routers/';


// blocks
import NavBar from './views/navbar';
import Footer from './views/footer';
import Unfounded from './routers/unfounded';


// components
const App = () => (
  <div>
    <NavBar />
    <div className="container">
      <Switch>
        {routers.map(({ path, exact, component: C, ...rest }) => (
          <Route key={path} path={path} exact={exact} render={(props) => (<C {...props} {...rest} />)} />
        ))}
        <Route render={(props) => (<Unfounded {...props} />)} />
      </Switch>
    </div>
    <Footer />
  </div>
);


// exports
export default App;
