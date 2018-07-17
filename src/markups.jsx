/* global __isBrowser__ */

import React, { Component } from 'react';
import { StaticRouter, BrowserRouter } from 'react-router-dom';


// modules
import { isClientSignedIn } from './client/utilities/auth';
import App from './client/app';


// helper
const loadParamData = (param) => (data) => () => {
  if (__isBrowser__) setTimeout(() => delete window[param], 0);
  return (__isBrowser__ ? window[param] : data) || null;
};


// markups
const RenderServer = (location, data, config, isServerSignedIn) => (
  <StaticRouter location={location} context={{}}>
    <App
      isSignedIn={isServerSignedIn}
      initialData={loadParamData('__INIT__')(data)}
      config={loadParamData('__CONFIG__')(config)}
    />
  </StaticRouter>
);

const RenderClient = () => (
  <BrowserRouter>
    <App
      isSignedIn={isClientSignedIn()}
      initialData={loadParamData('__INIT__')()}
      config={loadParamData('__CONFIG__')()}
    />
  </BrowserRouter>
);


// exports
export { RenderServer, RenderClient };
