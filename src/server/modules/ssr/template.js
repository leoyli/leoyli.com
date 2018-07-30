const serialize = require('serialize-javascript');


// fragments
const contentDeliverNetworks = () => (`
  <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.0/css/bootstrap.min.css" rel="stylesheet"
    integrity="sha384-9gVQ4dYFwwWSjIDZnLEWnxCjeSWFphJiwGPXr1jddIhOegiu1FwO5qRGvFXOdJZ4" crossorigin="anonymous">
`);

const reactClientSide = (config = {}, data = {}) => (`
  <link rel="stylesheet" type="text/css" href="/static/stylesheets/style.css">
  <script src="/static/scripts/bundle.js" defer></script>
  <script id="reactClientSideScript">
    document.getElementById('reactClientSideScript').remove();
    window.__CONFIG__ = ${serialize(config, { isJSON: true })};
    window.__INIT__ = ${serialize(data, { isJSON: true })};
  </script>
`);

const googleAnalytics = (trackingId) => {
  if (!trackingId) return '';
  return (`
    <script async src="https://www.googletagmanager.com/gtag/js?id=${trackingId}"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
    </script>
  `);
};

const socialMeta = (featured) => {
  if (!featured) return '';
  return (`
    <meta property="og:image" content=${featured} />
    <meta property="og:image:type" content="image/png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
  `);
};


// template
const template = ({ config, data, body, featured } = {}) => (`
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <title>${config.siteName}</title>
    ${socialMeta(featured)}
    ${contentDeliverNetworks()}
    ${reactClientSide(config, data)}
    ${googleAnalytics(process.env.GTAG_ID)}
  </head>
  <body>
    <div id="root">${body}</div>
  </body>
  </html>
`);


// exports
module.exports = {
  template,
};

Object.defineProperty(module.exports, Symbol.for('__TEST__'), {
  value: {
    ...module.exports,
  },
});
