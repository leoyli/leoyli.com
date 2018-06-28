/* global __isBrowser__ */

import decode from 'jwt-decode';
import auth0 from 'auth0-js';


// magic strings
const ID_TOKEN_KEY      = 'id_token';
const ACCESS_TOKEN_KEY  = 'access_token';
const RETURN_TO         = 'return_to';

const AUDIENCE          = 'https://leoyli.com/';
const CLIENT_ID         = 'b274K7Z8Mx7wsk41OGo79ixwwsHjMu8y';
const CLIENT_DOMAIN     = 'leoyli.auth0.com';
const REDIRECT_SIGNIN   = 'https://localhost:3443/signin';
const REDIRECT_SIGNOUT  = 'https://localhost:3443/signout';
const SCOPE             = 'admin';


// initialize
const webAuth = new auth0.WebAuth({
  clientID: CLIENT_ID,
  domain: CLIENT_DOMAIN,
});


// storage
const authStorage = {
  clearAllTokens: () => {
    localStorage.removeItem(ID_TOKEN_KEY);
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    document.dispatchEvent(new Event('_authenticationStateChanged'));
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
  if (__isBrowser__) window.__decode__ = decode;
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
    returnTo: REDIRECT_SIGNOUT,
    client_id: CLIENT_ID,
  });
};

const _handleSignIn = ({ returnTo } = {}, cb) => {
  try {
    webAuth.parseHash({ hash: window.location.hash }, (err, authResult) => {
      if (err) return cb(err);
      authStorage.idToken.set(authResult.idToken);
      authStorage.accessToken.set(authResult.accessToken);
      document.dispatchEvent(new Event('_authenticationStateChanged'));
      setTimeout(authStorage.clearAllWebAuthStateCaches, 0);
      return cb(null, authStorage.returnTo.pop());
    });
  } catch (err) {
    if (returnTo) authStorage.returnTo.set(returnTo);
    webAuth.authorize({
      responseType: 'token id_token',
      redirectUri: REDIRECT_SIGNIN,
      audience: AUDIENCE,
      scope: SCOPE,
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
