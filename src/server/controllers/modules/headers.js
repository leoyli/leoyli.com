const { ContentSecurityPolicy } = require('./security/');


/**
 * headers for web security
 */
const securityHeaders = (req, res, next) => {
  const CSPConfigs = new ContentSecurityPolicy();
  CSPConfigs.addToWhitelist('script, style, font', 'https://stackpath.bootstrapcdn.com/');
  CSPConfigs.addToWhitelist('script, style', 'https://cdnjs.cloudflare.com/');
  CSPConfigs.addToWhitelist('connect', process.env.AUTH0_ISSUER);
  res.set({
    'Content-Security-Policy': CSPConfigs.generateRules(),
    'Cache-Control': 'max-age=0',
    'X-XSS-Protection': '1; mode=block',
    'X-Frame-Options': 'DENY',
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
