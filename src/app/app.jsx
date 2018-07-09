import React, { Fragment } from 'react';
import { Switch, Route } from 'react-router-dom';
import { Redirect } from 'react-router';


// modules
import { routers } from './router.config';
import { isClientSignedIn } from './utilities/auth';
import { fetchData } from './utilities/fetch/lib';
import Navbar from './layouts/navbar';
import Footer from './layouts/footer';
import Unfounded from './routers/unfounded';
import style from './styles/styles.scss';
import fontawesome from './utilities/fontawesome';


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
    const { state: { isSignedIn, _$CONFIG }, props: appProps } = this;
    return (
      <Fragment>
        <Navbar isSignedIn={isSignedIn} _$CONFIG={_$CONFIG} />
        <div className="container _-body">
          <Switch>
            {routers.map(({ path, exact, secure, component: C, ...rest }) => (
              <Route
                key={path}
                path={path}
                exact={exact}
                render={(props) => (secure && !isSignedIn
                  ? (<Redirect to="/signin" />)
                  : (<C {...props} {...rest} {...appProps} isSignedIn={isSignedIn} _$CONFIG={_$CONFIG} />))
                }
              />
            ))}
            <Route render={(props) => (<Unfounded {...props} _$CONFIG={_$CONFIG} />)} />
          </Switch>
        </div>
        <Footer _$CONFIG={_$CONFIG} />
      </Fragment>
    );
  }
}


// exports
export default App;
