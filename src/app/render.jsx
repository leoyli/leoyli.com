import React from 'react';
import { StaticRouter, BrowserRouter } from 'react-router-dom';
import App from './';


// markups
const renderServer = (location, data) => (
  <StaticRouter location={location} context={data}>
    <App />
  </StaticRouter>
);

const renderClient = () => (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);


// exports
export { renderServer, renderClient };
