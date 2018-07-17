/* eslint-disable prefer-destructuring */
/* global __isBrowser__ */

import decode from 'jwt-decode';
import WebAuth from 'auth0-js/src/web-auth';


// variables
const AUTH0_AUDIENCE = process.env.AUTH0_AUDIENCE;
const AUTH0_CLIENT_ID = process.env.AUTH0_CLIENT_ID;
const AUTH0_DEFAULT_SCOPE = process.env.AUTH0_DEFAULT_SCOPE;
const AUTH0_REDIRECT_SIGNOUT = process.env.AUTH0_REDIRECT_SIGNOUT;
const AUTH0_REDIRECT_SIGNIN = process.env.AUTH0_REDIRECT_SIGNIN;
const AUTH0_SERVER_DOMAIN = process.env.AUTH0_SERVER_DOMAIN;


// configs
const ID_TOKEN_KEY      = 'id_token';
const ACCESS_TOKEN_KEY  = 'access_token';
const RETURN_TO         = 'return_to';


// initialize
const webAuth = new WebAuth({
  clientID: AUTH0_CLIENT_ID,
  domain: AUTH0_SERVER_DOMAIN,
});


// storage
const authStorage = {
  clearAllTokens: () => {
    localStorage.removeItem(ID_TOKEN_KEY);
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  },
  clearAllWebAuthStateCaches: () => {
    const storedKeys = Object.keys(localStorage);
    for (let i = storedKeys.length - 1, key = storedKeys[i]; i > -1; key = storedKeys[i -= 1]) {
      if (key.includes('com.auth0.auth.')) localStorage.removeItem(key);
    }
  },
  idToken: {
    set: (token) => localStorage.setItem(ID_TOKEN_KEY, token),
    get: () => localStorage.getItem(ID_TOKEN_KEY),
    remove: () => localStorage.removeItem(ID_TOKEN_KEY),
  },
  accessToken: {
    set: (token) => localStorage.setItem(ACCESS_TOKEN_KEY, token),
    get: () => localStorage.getItem(ACCESS_TOKEN_KEY),
    remove: () => localStorage.removeItem(ACCESS_TOKEN_KEY),
  },
  returnTo: {
    set: (path) => localStorage.setItem(RETURN_TO, path || '/'),
    pop: () => {
      const pathname = localStorage.getItem(RETURN_TO) || '/';
      localStorage.removeItem(RETURN_TO);
      return pathname;
    },
  },
};


// validation
const isTokenExpired = (token) => {
  if ((decode(token).exp * 1000) > Date.now()) return false;
  authStorage.clearAllTokens();
  return true;
};

const isClientSignedIn = () => {
  if (__isBrowser__) {
    const token = authStorage.accessToken.get();
    return !!token && !isTokenExpired(token);
  }
};


// event handlers
const _handleSignOut = () => {
  authStorage.clearAllTokens();
  webAuth.logout({
    returnTo: AUTH0_REDIRECT_SIGNOUT,
    client_id: AUTH0_CLIENT_ID,
  });
};

const _handleSignIn = ({ returnTo } = {}, cb) => {
  try {
    webAuth.parseHash({ hash: window.location.hash }, (err, authResult) => {
      if (err) return cb(err);
      authStorage.idToken.set(authResult.idToken);
      authStorage.accessToken.set(authResult.accessToken);
      setTimeout(authStorage.clearAllWebAuthStateCaches, 0);
      return cb(null, authStorage.returnTo.pop());
    });
  } catch (err) {
    if (returnTo) authStorage.returnTo.set(returnTo);
    webAuth.authorize({
      responseType: 'token id_token',
      redirectUri: AUTH0_REDIRECT_SIGNIN,
      audience: AUTH0_AUDIENCE,
      scope: AUTH0_DEFAULT_SCOPE,
    });
  }
};


// exports
export {
  authStorage,
  isTokenExpired,
  isClientSignedIn,
  _handleSignIn,
  _handleSignOut,
};
