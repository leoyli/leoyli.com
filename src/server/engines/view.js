const { matchPath } = require('react-router-dom');
const { renderToString } = require('react-dom/server');
const { routers } = require('../../app/routers/');
const { renderServer } = require('../../app/render');


const template = ({ title, data, body } = {}) => (`
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <title>${title}</title>
    <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.0/css/bootstrap.min.css" rel="stylesheet"
      integrity="sha384-9gVQ4dYFwwWSjIDZnLEWnxCjeSWFphJiwGPXr1jddIhOegiu1FwO5qRGvFXOdJZ4" crossorigin="anonymous">
    <link rel="stylesheet" type="text/css" href="/static/stylesheets/style.css">
    <script>window.__INIT__ = ${JSON.stringify(data)};</script>
    <script src="/static/scripts/bundle.js" defer></script>
  </head>
  <body>
    <div id="root">${body}</div>
  </body>
  </html>
`);


const serverSideRendering = async function serverSideRendering(req, res, next) {
  const activeRoute = routers.find(route => matchPath(req.path, route)) || {};
  const data = activeRoute.fetch ? await activeRoute.fetch(req.url) : {};
  const title = activeRoute.title || '';
  const body = renderToString(renderServer(req.url, data));
  res.send(template({ title, data, body }));
};


// exports
module.exports = {
  serverSideRendering,
};

Object.defineProperty(module.exports, Symbol.for('__TEST__'), {
  value: {
    template,
    ...module.exports,
  },
});
