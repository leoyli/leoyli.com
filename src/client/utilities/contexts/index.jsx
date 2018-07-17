import React, { createContext } from 'react';


// contexts
const AuthState = createContext({
  isSignedIn: false,
});

const WebConfig = createContext({});


// exports
export { AuthState, WebConfig };
