const { matchPath } = require('react-router-dom');
const { renderToString } = require('react-dom/server');
const { routers } = require('../../../client/router.config');
const { APIRequest } = require('../../../client/utilities/fetch');
const { RenderServer } = require('../../../markups');
const { template } = require('./template');
const { _U_ } = require('../../utilities');


// middleware
const serverSideRenderer = async (req, res) => {
  const activeRoute = routers.find(route => matchPath(req.path, route)) || {};
  const { secure, fetchPath } = activeRoute;
  const { config } = res.locals;
  const isServerSignedIn = req.session && !!req.session.accessToken;
  const data = secure
    ? (fetchPath && isServerSignedIn ? await APIRequest(fetchPath)(req) : null)
    : (fetchPath ? await APIRequest(fetchPath)(req) : null);
  const { featured } = (data && data.post) || {};
  const body = renderToString(RenderServer(req.url, data, config, isServerSignedIn));
  if (data && data._status === 401) return res.redirect('/signin');
  res.send(template({ config, data, body, featured }));
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
