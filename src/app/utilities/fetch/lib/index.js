/* global __isBrowser__ */

const qs = require('qs');
const nodeFetch = require('node-fetch');
const { authStorage } = require('../../auth');


// env
const { API_SERVICES } = process.env;


// helper
const parseRouteParams = (pattern, path) => {
  const routeParams = {};
  const patternTree = pattern.split('/');
  const pathTree = path.split('/');
  for (let i = 0, j = patternTree.length; i < j; i += 1) {
    if (patternTree[i] !== pathTree[i]) {
      if (patternTree[i].startsWith(':')) routeParams[patternTree[i].slice(1)] = pathTree[i];
      else break;
    }
  }
  return routeParams;
};

const APIRequest = (routePath) => ({
  path    = __isBrowser__ ? window.location.pathname : '',
  search  = __isBrowser__ ? window.location.search : '',
  method  = 'GET',
  token   = '',
  query   = {},
  params  = {},
  headers = {},
  session = {},
  data    = {},
} = {}) => {
  const fetchDriver = __isBrowser__ ? fetch : nodeFetch;

  // address
  const routeParams = Object.keys(params).length ? params : parseRouteParams(routePath, path);
  const reducedPath = routePath.replace(/:(\w+)/g, (match, key) => routeParams[key]);
  const queryString = qs.stringify(query, { addQueryPrefix: true }) || search;
  const url = `${API_SERVICES}${reducedPath}${queryString}`;

  // authentication
  const accessToken = token || (__isBrowser__ ? authStorage.accessToken.get() : session.accessToken);
  const authorization = accessToken ? `Bearer ${accessToken}` : undefined;

  // data
  const body = ['POST', 'PATCH', 'PUT'].includes(method) && data
    ? new URLSearchParams(data.constructor.name === 'HTMLFormElement'
      ? [...new FormData(data).entries()]
      : Object.entries(data))
    : undefined;

  // fetch
  return fetchDriver(url, {
    credentials: 'same-origin',
    headers: { authorization, ...headers },
    method,
    body,
  }).then(res => res.json());
};


// exports
module.exports = {
  APIRequest,
};
