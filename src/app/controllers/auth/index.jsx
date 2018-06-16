/* global __isBrowser__ */

import decode from 'jwt-decode';
import auth0JS from 'auth0-js';


// magic strings
const ID_TOKEN_KEY      = 'id_token';
const ACCESS_TOKEN_KEY  = 'access_token';

const AUDIENCE          = 'https://leoyli.com/';
const CLIENT_ID         = 'b274K7Z8Mx7wsk41OGo79ixwwsHjMu8y';
const CLIENT_DOMAIN     = 'leoyli.auth0.com';
const REDIRECT          = 'https://localhost:3443/auth';
const SCOPE             = 'admin';


// initialize
const auth0 = new auth0JS.WebAuth({
  clientID: CLIENT_ID,
  domain: CLIENT_DOMAIN,
});


// token storage
const setIdToken        = (token) => localStorage.setItem(ID_TOKEN_KEY, token);
const setAccessToken    = (token) => localStorage.setItem(ACCESS_TOKEN_KEY, token);
const getIdToken        = () => localStorage.getItem(ID_TOKEN_KEY);
const getAccessToken    = () => localStorage.getItem(ACCESS_TOKEN_KEY);
const clearIdToken      = () => localStorage.removeItem(ID_TOKEN_KEY);
const clearAccessToken  = () => localStorage.removeItem(ACCESS_TOKEN_KEY);


// validation
const isTokenExpired = (token) => decode(token).exp * 1000 < Date.now();
const isSignedIn = () => {
  if (__isBrowser__) {
    const idToken = getIdToken();
    return !!idToken && !isTokenExpired(idToken);
  }
};


// event handlers
const onClickSignIn = () => auth0.authorize({
  responseType: 'token id_token',
  redirectUri: REDIRECT,
  audience: AUDIENCE,
  scope: SCOPE,
});

const onClickSignOut = () => {
  clearIdToken();
  clearAccessToken();
  window.location.href = '/';
};

const _handleAuthResult = () => auth0.parseHash({ hash: window.location.hash }, (err, authResult) => {
  if (!err) {
    setIdToken(authResult.idToken);
    setAccessToken(authResult.accessToken);
  }
  window.location.href = '/';
});


// exports
export {
  isTokenExpired,
  isSignedIn,
  onClickSignOut,
  onClickSignIn,
  _handleAuthResult,
};
