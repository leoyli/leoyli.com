const { matchPath } = require('react-router-dom');
const { renderToString } = require('react-dom/server');


// modules
const { routers } = require('../../../client/router.config');
const { APIRequest } = require('../../../client/utilities/fetch');
const { RenderServer } = require('../../../markups');
const { template } = require('./template');
const { _U_ } = require('../../utilities');


// middleware
const serverSideRenderer = async (req, res) => {
  const { secure, fetchPath } = routers.find(route => matchPath(req.path, route)) || {};
  const isServerSignedIn = req.session && !!req.session.accessToken;
  const config = req.app.get('APP_CONFIG');
  const data = secure
    ? (fetchPath && isServerSignedIn ? await APIRequest(fetchPath)(req) : null)
    : (fetchPath ? await APIRequest(fetchPath)(req) : null);
  const body = renderToString(RenderServer(req.url, data, config, isServerSignedIn));
  if (data && data._status === 401) return res.redirect('/signin');
  return res.send(template({ data, config, body }));
};


// exports
module.exports = {
  serverSideRenderer: _U_.express.wrapAsync(serverSideRenderer),
};

Object.defineProperty(module.exports, Symbol.for('__TEST__'), {
  value: {
    template,
    ...module.exports,
  },
});
