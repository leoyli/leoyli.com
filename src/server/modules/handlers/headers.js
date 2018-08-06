const { ContentSecurityPolicy } = require('../security');


/**
 * headers for web security
 */
const securityHeaders = (req, res, next) => {
  const CSPConfigs = new ContentSecurityPolicy();
  // CDN networking
  CSPConfigs.addToWhitelist('script, style, font', 'https://cdnjs.cloudflare.com');
  CSPConfigs.addToWhitelist('style, font', 'https://fonts.googleapis.com');
  CSPConfigs.addToWhitelist('font', 'https://fonts.gstatic.com');
  CSPConfigs.addToWhitelist('font', 'data: fonts.gstatic.com');

  // auth0
  CSPConfigs.addToWhitelist('connect', `https://${process.env.AUTH0_SERVER_DOMAIN}`);

  // GitHub Gist
  CSPConfigs.addToWhitelist('script', 'https://gist.github.com');
  CSPConfigs.addToWhitelist('style', 'https://assets-cdn.github.com');

  // google analytics
  CSPConfigs.addToWhitelist('script', 'https://www.googletagmanager.com');
  CSPConfigs.addToWhitelist('script, connect', 'https://www.google-analytics.com');

  // in-site API
  CSPConfigs.addToWhitelist('connect', process.env.API_SERVICES);
  res.set({
    'Content-Security-Policy': CSPConfigs.generateRules(),
    'Cache-Control': 'max-age=0',
    'X-XSS-Protection': '1; mode=block',
    'X-Frame-Options': 'ALLOW-FROM https://gist.github.com/',
  });
  return next();
};


/**
 * headers for CORS communications
 */
const CORSHeaders = (req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*'); // todo: bind with domain name
  res.set('Access-Control-Allow-Methods', 'GET, PUT, HEAD, OPTIONS'); // todo: create OPTION route @engine
  res.set('Access-Control-Allow-Headers', 'Content-Type, Cache-Control, Cookies, Authorization');
  res.set('Access-Control-Allow-credentials', 'true');
  res.set('Access-Control-Max-Age', '600');
  return next();
};


/**
 * header for denying crawlers
 */
const noCrawlerHeader = (req, res, next) => {
  res.set('Cache-Control', 'private, max-age=0');
  res.set('x-robots-tag', 'none');
  if (typeof next === 'function') return next();
};


/**
 * header for preventing from caching
 */
const noStoreCacheHeader = (req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate');
  if (typeof next === 'function') return next();
};


// exports
module.exports = {
  securityHeaders,
  CORSHeaders,
  noCrawlerHeader,
  noStoreCacheHeader,
};

Object.defineProperty(module.exports, Symbol.for('__TEST__'), {
  value: {
    ...module.exports,
  },
});
