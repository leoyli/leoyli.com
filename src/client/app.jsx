/* global __isBrowser__, gtag */

import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import { Redirect } from 'react-router';


// modules
import { isClientSignedIn } from './utilities/auth';
import { AuthState, WebConfig } from './utilities/contexts';
import { routers } from './router.config';
import Navbar from './layouts/navbar';
import Footer from './layouts/footer';
import Unfounded from './routers/unfounded';
import fontawesome from './utilities/fontawesome';
import style from './styles/styles.scss';


// components
class App extends Component {
  state = { isSignedIn: this.props.isSignedIn, webConfig: this.props.config() };

  _updateWebConfig = (webConfig) => {
    this.setState(() => ({ webConfig }));
  };

  _updateAuthState = () => {
    this.setState(() => ({ isSignedIn: isClientSignedIn() }));
  };

  render = () => {
    const { isSignedIn, webConfig } = this.state;
    const appProps = this.props;
    const authStateValue = { isSignedIn, update: this._updateAuthState };
    const webConfigValue = { ...webConfig, update: this._updateWebConfig };
    return (
      <WebConfig.Provider value={webConfigValue}>
        <AuthState.Provider value={authStateValue}>
          <Navbar />
          <main className="container _-body">
            <Switch>
              {routers.map(({ path, exact, secure, component: C, ...rest }) => (
                <Route
                  key={path}
                  path={path}
                  exact={exact}
                  render={(receivedProps) => {
                    // google analytics
                    if (__isBrowser__ && 'gtag' in window) {
                      gtag('config', webConfig.services.googleAnalytics, {
                        page_path: receivedProps.location.pathname,
                      });
                    }

                    // router screaming
                    return (secure && !isSignedIn
                      ? (<Redirect to="/signin" />)
                      : (<C {...appProps} {...receivedProps} {...rest} />));
                  }}
                />
              ))}
              <Route render={(routerProps) => (<Unfounded {...appProps} {...routerProps} />)} />
            </Switch>
          </main>
          <Footer />
        </AuthState.Provider>
      </WebConfig.Provider>
    );
  };
}


// exports
export default App;
