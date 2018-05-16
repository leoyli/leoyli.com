/**
 * API services
 */
const APIHeader = function APIHeader(req, res, next) {
  res.set('x-robots-tag', 'none');
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, PUT, HEAD, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Cache-Control');
  if (typeof next === 'function') return next();
};


/**
 * prohibit crawlers
 */
const noCrawlerHeader = function noCrawlerHeader(req, res, next) {
  res.set('Cache-Control', 'private, max-age=0');
  res.set('x-robots-tag', 'none');
  if (typeof next === 'function') return next();
};


/**
 * prevent from caches stoage
 */
const noStoreCacheHeader = function noStoreCacheHeader(req, res, next) {
  res.set('Cache-Control', 'no-store');
  if (typeof next === 'function') return next();
};


// exports
module.exports = {
  APIHeader,
  noCrawlerHeader,
  noStoreCacheHeader,
};

Object.defineProperty(module.exports, Symbol.for('__TEST__'), {
  value: {
    ...module.exports,
  },
});
