import React, { Component } from 'react';
import { Redirect } from 'react-router';


// modules
import { _handleSignIn, isClientSignedIn, authStorage } from '../../utilities/auth';
import { APIRequest } from '../../utilities/fetch';
import { AuthState } from '../../utilities/contexts';


// components
class SignIn extends Component {
  state = { returnTo: null };

  componentDidMount = () => {
    const { returnTo } = this.state;
    const { location, sendPath, updateAuthState } = this.props;
    if (returnTo === null) {
      _handleSignIn(location.state, (err, path = '/') => {
        if (err) throw err;
        this.setState(() => ({ returnTo: path, isSignedIn: true }));
        return APIRequest(sendPath)({ data: null, method: 'POST' })
          .then(({ accessToken }) => {
            if (accessToken !== authStorage.accessToken.get()) authStorage.clearAllTokens();
            updateAuthState();
          });
      });
    }
  };

  render = () => {
    const { returnTo } = this.state;
    if (returnTo === null) return null;
    return (<Redirect to={returnTo} />);
  };
}


const SignInWithAuthStateContext = (props) => (
  <AuthState.Consumer>
    {({ isSignedIn, update }) => {
      if (isSignedIn && isClientSignedIn()) return (<Redirect to="/" />);
      return <SignIn updateAuthState={update} {...props} />;
    }}
  </AuthState.Consumer>
);


// exports
export default SignInWithAuthStateContext;
