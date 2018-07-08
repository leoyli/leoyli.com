import React, { Fragment } from 'react';
import { Switch, Route } from 'react-router-dom';
import { Redirect } from 'react-router';
import { routers } from './router.config';
import { isClientSignedIn } from './libs/auth';
import { fetchData } from './widgets/fetch/lib';


// font-awesome
import fontawesome from './libs/fontawesome';


// blocks
import NavBar from './templates/navbar';
import Footer from './templates/footer';
import Unfounded from './routers/unfounded';


// components
class App extends React.Component {
  state = { isSignedIn: this.props.isSignedIn, _$CONFIG: this.props.config() };

  componentDidMount() {
    document.addEventListener('_authenticationStateChanged', () => {
      this.setState(() => ({ isSignedIn: isClientSignedIn() }));
    });
    document.addEventListener('_configUpdated', () => {
      const request = fetchData('/util/settings');
      request().then((res) => this.setState(() => ({ _$CONFIG: res.config })));
    });
  }

  render() {
    return (
      <Fragment>
        <NavBar isSignedIn={this.state.isSignedIn} _$CONFIG={this.state._$CONFIG} />
        <div className="container _-body">
          <Switch>
            {routers.map(({ path, exact, secure, component: C, ...rest }) => (
              <Route
                key={path}
                path={path}
                exact={exact}
                render={(props) => (
                  secure && !this.state.isSignedIn
                    ? (<Redirect to="/signin" />)
                    : (<C
                      {...props}
                      {...rest}
                      {...this.props}
                      isSignedIn={this.state.isSignedIn}
                      _$CONFIG={this.state._$CONFIG}
                    />)
                )}
              />
            ))}
            <Route render={(props) => (<Unfounded {...props} _$CONFIG={this.state.config} />)} />
          </Switch>
        </div>
        <Footer _$CONFIG={this.state._$CONFIG} />
      </Fragment>
    );
  }
}


// exports
export default App;
