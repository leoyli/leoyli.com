import React, { Component } from 'react';
import { _handleAuthResult } from '../controllers/auth';


// components
class Auth extends Component {
  componentDidMount() {
    _handleAuthResult();
  }

  render() {
    return null;
  }
}


// exports
export default Auth;
