const Router = require('express').Router;



// modules
const templateHandler = require('../views/template');
const { _M_ } = require('../middleware/plugins');
const { _U_ } = require('../utilities/');



// helpers
/**
 * wrap asyncfunctions with an error catcher                                                                            // note: `asyncWrapper` may be generalized
 * @param {(array|function)} fn             - fn may be wrapped
 * @return {array}                          - task is triggered only when keyword 'async' is met
 */
const asyncWrapper = (fn) => {
  const wrapAsync = (fn) => (req, res, next) => fn(req, res, next).catch(next);
  if (!_U_.object.checkNativeBrand(fn, 'Array')) fn = [fn];
  return fn.map(fn => _U_.object.checkNativeBrand(fn, 'AsyncFunction') ? wrapAsync(fn) : fn);
};

/**
 * normalize into a method array in the anti-alphabetical order
 * @param {(object|function)} controller    - controller may be extracted
 * @param {(string|regex)} [alias]          - alias to be watched
 * @param {(string|array)} [method]         - default: keys of controller{object} || `get`
 * @return {array}                          - ordering of the result is important ('alias' must be met after 'get')
 */
const stackHttpMethods = ({ controller, alias, method }) => {
  const methodList = method
    ? _U_.object.checkNativeBrand(method, 'String') ? [method] : method
    : _U_.object.checkNativeBrand(controller, 'Object') ? Object.keys(controller) : ['get'];
  if (alias && methodList.indexOf('alias') === -1) methodList.push('alias');
  return methodList.sort();
};

/**
 * stack a queue from setting
 * @param {string} [query]                  - accept case insensitive `req.query` (by Proxy)    default: insensitive
 * @param {boolean} [cache]                 - accept client-side caching?                       default: true
 * @param {boolean} [authorized]            - accept only authenticated? (load 4 fns)           default: false
 * @param {boolean} [authenticated]         - accept only authorized? (load 5 fns)              default: false
 * @param {boolean} [crawler]               - accept crawlers? (load 1 fn)                      default: true
 * @param {string} [title]                  - title tag name
 * @param {object} [titleOption]            - title tagging options (see _M_.setTitleTag())
 * @param {string} [method]                 - method to be watched
 * @return {Array}                          - ordering of the result is important
 */
const loadRoutePlugins = ({ query, cache, authorized, authenticated, crawler, title, titleOption } = {}, method) => {
  const queue = [];
  if (query !== 'sensitive') queue.push(_M_.caseInsensitiveQuery);
  if (cache === false) queue.push(_M_.doNotCached);
  if (authorized === true) queue.push(..._M_.isAuthorized);
  else if (authenticated === true) queue.push(..._M_.isSignedIn);
  else if (crawler === false) queue.push(_M_.doNotCrawled);
  if (title) queue.push(_M_.setTitleTag(title, titleOption));
  return queue;
};

/**
 * stack a queue from controllers with normalization
 * @param {(array|function)} controller     - controller to be stacked
 * @param {string} [method]                 - method to be used to extract property of the controller
 * @return {array}                          - if no matched method, the controller would just be normalized to an array
 */
const loadMainControls = (controller, method) => {
  const agent = _U_.object.proxyfiedForCaseInsensitiveAccess(controller);
  const worker = agent[method] ? agent[method] : agent;
  return _U_.object.checkNativeBrand(worker, 'Array') ? worker : [worker];
};

/**
 * stack a queue with a given template when HTTP method is 'get'
 * @param {string|null} [template]          - template file path
 * @param {string|null} [handler]           - template handler name
 * @param {string} method                   - method to be watched
 * @return {array}                          - task is triggered only when the method is 'alias' or 'get'
 */
const loadViewRenderer = ({ template, handler } = {}, method) => {
  return (['get', 'alias'].indexOf(method.toLowerCase()) > -1) && template ? [templateHandler(template, handler)] : [];
};


// main
/**
 * a routing device takes input setting outputting Express.js routing objects
 * @constructor
 * @param {array} rules                     - an array that contains routing rule objects
 * @param {object} [option]                 - (see express.Router() API)
 */
class Device {
  constructor(rules, option) {                                                                                          // todo: [private] make these private once JS supports
    this._router = new Router(option);
    this._queue = { pre: [], post: [] };
    this._rules = rules;
    this._handler = '';
  }

  get setting() {
    return new Proxy(this, {
      get: (target, name) => arg => name === 'handler'
        ? target._handler = arg
        : target.hook('pre', loadRoutePlugins({ [name]: arg })),
    });
  }

  set setting(obj) {
    Object.keys(obj).forEach(key => this.setting[key](obj[key]));
  }

  hook (position, fn) {
    if(!Array.isArray(fn)) fn = [fn];
    this._queue[position].push(...fn);
    return this;
  }

  use(fn) {
    this._router.use(fn);
    return this;
  }

  run() {
    this._rules.forEach(({ route, alias, controller, method, setting }) => {
      if (this._handler) setting = { handler: this._handler, ...setting };
      stackHttpMethods({ alias, controller, method })
        .forEach(method => this._router[(method === 'alias') ? 'get' : method.toLowerCase()](...asyncWrapper([
          (method === 'alias') ? alias : route,                                                                         // router path
          ...loadRoutePlugins(setting   , method),                                                                      // middleware plugins
          ...this._queue.pre,                                                                                           // universal pre-middleware
          ...loadMainControls(controller, method),                                                                      // router controller
          ...loadViewRenderer(setting   , method),                                                                      // template handler
          ...this._queue.post                                                                                           // universal post-middleware
        ])));
    });
    return this._router;
  }
}



// exports
module.exports = { Device, _test: {
    Device,
    asyncWrapper,
    stackHttpMethods,
    loadRoutePlugins,
    loadMainControls,
    loadViewRenderer,
  },
};
