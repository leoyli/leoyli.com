import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { isClientSignedIn, _handleSignIn, authStorage } from '../../utilities/auth';
import { APIRequest } from '../../utilities/fetch';


// components
class Signin extends Component {
  state = { isSignedIn: isClientSignedIn(), returnTo: '/' };

  componentDidMount = () => {
    const {
      state: { isSignedIn },
      props: { location, sendPath },
    } = this;
    if (isSignedIn) return null;
    _handleSignIn(location.state, (err, returnTo) => {
      if (err) throw err;
      this.setState(() => ({ returnTo, isSignedIn: true }));
      return APIRequest(sendPath)({ data: null, method: 'POST' })
        .then(({ accessToken }) => {
          if (accessToken !== authStorage.accessToken.get()) authStorage.clearAllTokens();
        });
    });
  };

  render = () => {
    const { isSignedIn, returnTo } = this.state;
    if (isSignedIn) return (<Redirect to={returnTo || '/'} />);
    return null;
  };
}


// exports
export default Signin;
