import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { isClientSignedIn, _handleSignIn, authStorage } from '../../libs/auth';


// components
class Signin extends Component {
  state = { isSignedIn: isClientSignedIn(), returnTo: '/' };

  componentDidMount = () => {
    if (this.state.isSignedIn) return null;
    _handleSignIn(this.props.location.state, (err, returnTo) => {
      if (err) throw err;
      this.setState(() => ({ returnTo, isSignedIn: true }));
      this.props.send({ data: null, method: 'POST' })
        .then(({ accessToken }) => {
          if (accessToken !== authStorage.accessToken.get()) authStorage.clearAllTokens();                              // todo: FAILED ON SERVER: show error to the client
        });
    });
  };

  render = () => {
    if (this.state.isSignedIn) return (<Redirect to={this.state.returnTo || '/'} />);
    return null;
  };
}


// exports
export default Signin;
