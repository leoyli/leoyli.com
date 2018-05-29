/**
 * prevent from parsing by crawlers
 */
const noCrawlerHeader = function noCrawlerHeader(req, res, next) {
  res.set('Cache-Control', 'private, max-age=0');
  res.set('x-robots-tag', 'none');
  if (typeof next === 'function') return next();
};


/**
 * prevent data storage from caches
 */
const noStoreCacheHeader = function noStoreCacheHeader(req, res, next) {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate');
  if (typeof next === 'function') return next();
};


// exports
module.exports = {
  noCrawlerHeader,
  noStoreCacheHeader,
};

Object.defineProperty(module.exports, Symbol.for('__TEST__'), {
  value: {
    ...module.exports,
  },
});
