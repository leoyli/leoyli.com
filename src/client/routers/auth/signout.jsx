import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { _handleSignOut, isClientSignedIn } from '../../utilities/auth';


// components
class SignOut extends Component {
  state = { isSignedIn: isClientSignedIn() };

  componentDidMount = () => {
    const { isSignedIn } = this.state;
    if (isSignedIn) return _handleSignOut();
  };

  render = () => {
    const { isSignedIn } = this.state;
    if (isSignedIn) return null;
    return (<Redirect to="/" />);
  };
}


// exports
export default SignOut;
