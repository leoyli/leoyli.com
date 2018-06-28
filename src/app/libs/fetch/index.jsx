/* global __isBrowser__ */

import qs from 'qs';
import https from 'https';
import nodeFetch from 'node-fetch';
import { authStorage } from '../auth/';


// configurations
const API_SERVER = 'https://localhost:3443/api';


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


const fetchData = (routePath) => ({
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
  const url = `${API_SERVER}${reducedPath}${queryString}`;

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
    agent: new https.Agent({ rejectUnauthorized: false }),
    credentials: 'same-origin',
    headers: { authorization, ...headers },
    method,
    body,
  }).then(res => res.json())
    .catch(err => {
      throw err;
    });
};


// exports
export default fetchData;