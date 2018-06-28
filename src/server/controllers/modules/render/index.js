const { matchPath } = require('react-router-dom');
const { renderToString } = require('react-dom/server');
const { routers } = require('../../../../app/router.config');
const { RenderServer } = require('../../../../app/render');
const { template } = require('./template');
const { _U_ } = require('../../../utilities');


// middleware
const serverSideRenderer = async (req, res) => {
  const activeRoute = routers.find(route => matchPath(req.path, route)) || {};
  const isServerSignedIn = req.session && !!req.session.accessToken;
  const { config } = res.locals;
  const data = activeRoute.secure
    ? (activeRoute.request && isServerSignedIn ? await activeRoute.request(req) : null)
    : (activeRoute.request ? await activeRoute.request(req) : null);
  const body = renderToString(RenderServer(req.url, data, config, isServerSignedIn));
  if (data && data._status === 401) return res.redirect('/signin');
  res.send(template({ config, data, body }));
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
