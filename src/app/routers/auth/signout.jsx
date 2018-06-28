import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { _handleSignOut, isClientSignedIn } from '../../libs/auth';


// components
class Signout extends Component {
  state = { isSignedIn: isClientSignedIn() };

  componentDidMount = () => {
    if (this.state.isSignedIn) return _handleSignOut();
  };

  render = () => {
    if (this.state.isSignedIn) return null;
    return (<Redirect to="/" />);
  };
}


// exports
export default Signout;
