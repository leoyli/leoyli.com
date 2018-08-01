const path = require('path');
const serialize = require('serialize-javascript');


// fragments
const metaTags = (post, config = {}) => {
  if (!post) return '';

  // tags builder
  const {
    general: { domain, siteName },
    services: { facebookApp, twitter },
  } = config;
  const { canonical, featured, title, content } = post;
  const absoluteUrl = `https://${path.join(domain, 'blog', canonical)}`;
  const description = content.length > 160
    ? `${content.slice(0, 160)}...`
    : content;

  let meta = {
    // open graph
    'og:site_name': siteName,
    'og:title': title,
    'og:url': absoluteUrl,
    'og:description': description,
    'og:type': 'article',

    // social media
    'fb:app_id': facebookApp,
    'twitter:site': siteName,
    'twitter:creator': twitter ? `@${twitter}` : '',
  };

  if (featured) {
    const absoluteImageUrl = `https://${path.join(domain, featured)}`;
    meta = {
      ...meta,

      // open graph
      'og:image': absoluteImageUrl,
      'og:image:alt': title,
      'og:image:type': featured.split('.').pop(),
      'og:image:width': 1200,
      'og:image:height': 630,

      // twitter
      'twitter:card': 'summary_large_image',
    };
  }

  return (`
    ${Object.keys(meta).reduce((str, tag) => {
      if (!meta[tag]) return str;
      return (`${str}\n\t<meta property='${tag}' content='${meta[tag]}' />`);
    }, '')}
  `);
};


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


// template
const template = ({ config, data, body } = {}) => (`
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <title>${config.general.siteName}</title>
    ${reactClientSide(config, data)}
    ${contentDeliverNetworks()}
    ${metaTags(data && data.post, config)}
    ${googleAnalytics(config.services.googleAnalytics)}
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
