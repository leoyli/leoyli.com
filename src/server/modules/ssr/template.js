const serialize = require('serialize-javascript');


// template
const template = ({ config, data, body } = {}) => {
  const googleAnalytics = (id) => (`
    <!-- Global site tag (gtag.js) - Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=${id}"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
    </script>
  `);

  return (`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
      <title>${config.siteName}</title>
      <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.0/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-9gVQ4dYFwwWSjIDZnLEWnxCjeSWFphJiwGPXr1jddIhOegiu1FwO5qRGvFXOdJZ4" crossorigin="anonymous">
      <link rel="stylesheet" type="text/css" href="/static/stylesheets/style.css">
      <script>
        document.scripts[0].remove();
        window.__CONFIG__ = ${serialize(config, { isJSON: true })};
        window.__INIT__ = ${serialize(data, { isJSON: true })};
      </script>
      <script src="/static/scripts/bundle.js" defer></script>
      ${process.env.GTAG_ID ? googleAnalytics(process.env.GTAG_ID) : ''}
    </head>
    <body>
      <div id="root">${body}</div>
    </body>
    </html>
  `);
};


// exports
module.exports = {
  template,
};

Object.defineProperty(module.exports, Symbol.for('__TEST__'), {
  value: {
    ...module.exports,
  },
});
