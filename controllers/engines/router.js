const Router = require('express').Router;



// modules
const templateHandler = require('../views/template');
const { _M_ } = require('../middleware/');
const { _U_ } = require('../utilities/');



// helpers
/**
 * wrap asyncfunctions with an error catcher
 * @param {array|function} target           - fn may be wrapped
 * @return {array|function}                 - task is triggered only when keyword 'async' is found
 */
const asyncWrapper = (target) => {
  const wrapper = (fn) => (req, res, next) => fn(req, res, next).catch(next);
  const evaluator = (fn) => _U_.object.checkNativeBrand(fn, 'AsyncFunction') ? wrapper(fn) : fn;
  const type = _U_.object.checkNativeBrand(target);
  if (type === 'Array') return target.map(fn => evaluator(fn));
  if (type.toLowerCase().includes('function')) return evaluator(target);
  throw new TypeError(`Argument is neither an Array nor an AsyncFunction but a ${type}.`);
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
 * @return {array}                          - ordering of the result is important
 */
const getPreprocessor = ({ query, cache, authorized, authenticated, crawler, title, titleOption } = {}) => {
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
 *
 * @param {array|function} protagonist      - the main controlling logic
 * @param {object} hooker                   - pre/post hooked middleware on the device
 * @param {object} setting                  - router settings
 * @return {array}
 */
const getMiddlewareChain = (protagonist, hooker, setting) => {
  const preprocessor = getPreprocessor(setting);
  const viewHandler = templateHandler(setting.template, setting.handler);
  return asyncWrapper([].concat(preprocessor, hooker.pre, protagonist, hooker.post, viewHandler));
};


// main
/**
 * a routing device takes input setting outputting Express.js routing objects
 * @constructor
 * @param {array} rules                     - an array that contains routing rule objects
 * @param {object} [option]                 - (see express.Router() API)
 */
class Device {
  constructor(rules, option) {                                                                                         
    this.router = new Router(option);
    this.queue = { pre: [], post: [] };
    this.rules = rules;
    this.handler = null;
  }

  get setting() {
    return new Proxy(this, {
      get: (target, name) => arg => name === 'handler'
        ? target.handler = arg
        : target.hook('pre', getPreprocessor({ [name]: arg })),
    });
  }

  set setting(obj) {
    Object.keys(obj).forEach(key => this.setting[key](obj[key]));
  }

  hook (position, fn) {
    this.queue[position].push(...(_U_.object.checkNativeBrand(fn, 'Array') ? fn : [fn]));
    return this;
  }

  use(fn) {
    this.router.use(fn);
    return this;
  }

  run() {
    // router registrations
    this.rules.forEach(({ route, alias, controller, setting }) => {
      const controlKeys = Object.keys(controller).sort();
      const settingWrap = { handler: this.handler, ...setting };

      // method registrations
      controlKeys.forEach(key => {
        if (key === 'alias' && !alias) throw new ReferenceError('Parameter "alias" have to be provided.');
        const path = key === 'alias' ? alias : route;
        const method = key === 'alias' ? 'get' : key.toLowerCase();
        this.router[method](path, getMiddlewareChain(controller[key], this.queue, settingWrap));
      });
    });
    return this.router;
  }
}



// exports
module.exports = { Device, _test: {
    Device,
    asyncWrapper,
    getPreprocessor,
    getMiddlewareChain,
  },
};
