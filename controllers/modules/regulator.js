const { _U_ } = require('../utilities/');


/** HTTP headers: API services **/
const APIHeader = function APIHeader(req, res, next) {
  res.set('x-robots-tag', 'none');
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, PUT, HEAD, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Cache-Control');
  if (typeof next === 'function') return next();
};


/** HTTP headers: no crawlers **/
const noCrawlerHeader = function noCrawlerHeader(req, res, next) {
  res.set('Cache-Control', 'private, max-age=0');
  res.set('x-robots-tag', 'none');
  if (typeof next === 'function') return next();
};


/** HTTP headers: no caches stored **/
const noStoreCacheHeader = function noStoreCacheHeader(req, res, next) {
  res.set('Cache-Control', 'no-store');
  if (typeof next === 'function') return next();
};


/** Object proxy for case insensitive access **/
const caseInsensitiveProxy = function caseInsensitiveProxy(req, res, next) {
  req.query = _U_.object.createCaseInsensitiveProxy(req.query);
  if (typeof next === 'function') return next();
};


/**
 * HTML title tag modification
 * @param {(object|string)} options
 */
const modifyHTMLTitleTag = (options) => function modifyHTMLTitleTag(req, res, next) {
  if (res.locals.$$MODE === 'api') return next();

  const sequence = [];
  if (options.root !== false) sequence.push(res.locals.$$VIEW.title);
  if (options.append === true) sequence.push(options.name || options);
  else sequence.unshift(options.name || options);
  res.locals.$$VIEW.title = sequence.join(' - ');
  if (typeof next === 'function') return next();
};


// exports
module.exports = { APIHeader, noCrawlerHeader, noStoreCacheHeader, caseInsensitiveProxy, modifyHTMLTitleTag };
