const Router = require('express').Router;



// modules
const { _M_ } = require('../modules/');
const { _U_ } = require('../utilities/');
const templateHandler = require('../views/handler');



// helpers
/**
 * wrap asyncfunctions with an error catcher
 * @param {array|function} target           - fn may be wrapped
 * @return {array|function}                 - task is triggered only when keyword 'async' is found
 */
const asyncWrapper = (target) => {
  const unnamedWrapper = (fn) => (req, res, next) => fn(req, res, next).catch(next);
  const namedWrapper = (fn) => Object.defineProperty(unnamedWrapper(fn), 'name', { value: fn.name });
  const evaluator = (fn) => _U_.object.checkNativeBrand(fn, 'AsyncFunction') ? namedWrapper(fn) : fn;
  const type = _U_.object.checkNativeBrand(target);
  if (type === 'Array') return target.map(fn => evaluator(fn));
  if (type.toLowerCase().includes('function')) return evaluator(target);
  throw new TypeError(`Argument is neither an Array nor an AsyncFunction but a ${type}.`);
};


/**
 * stack a queue from setting options
 * @param {object} options                  - setting options
 * @return {array}                          - ordering of the result is important
 */
const getPreprocessor = (options) => {
  const queue = [];
  if (options.servingAPI      !== true)     queue.push(_M_.responseHTMLRequest);
  if (options.servingAPI      === true)     queue.push(_M_.responseAPIRequest);
  if (options.sensitive       !== true)     queue.push(_M_.caseInsensitiveProxy);
  if (options.authorization   === true)     queue.push(..._M_.isAuthorized);
  if (options.authentication  === true)     queue.push(..._M_.isSignedIn);
  if (options.crawler         === false)    queue.push(_M_.noCrawlerHeader);
  if (options.cache           === false)    queue.push(_M_.noStoreCacheHeader);
  return queue;
};


/**
 * compose an ordered, unique middleware firing chain
 * @param {array|function} protagonist      - the main controlling logic
 * @param {object} hooker                   - pre/post hooked middleware on the device
 * @param {object} options                  - router settings
 * @return {array}
 */
const getMiddlewareChain = (protagonist, hooker, options) => {
  const preprocessor = getPreprocessor(options);
  const renderer = !options.servingAPI ? templateHandler(options) : [];
  const decorator = !options.servingAPI && options.title ? _M_.modifyHTMLTitleTag(options.title): [];
  return asyncWrapper([...new Set([].concat(preprocessor, hooker.pre, decorator, protagonist, hooker.post, renderer))]);
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
    this.rules = rules;
    this.defaultSetting = {};
    this.queue = { pre: [], post: [] };
  }

  get setting() {
    return new Proxy(this.defaultSetting, {
      set: (defaultSetting, option, value) => {
        if (option === 'title') this.queue.pre.push(_M_.modifyHTMLTitleTag(value));
        else defaultSetting[option] = value;
        return true;
      },
    });
  };

  set setting(options) {
    Object.keys(options).forEach(key => this.setting[key] = options[key]);
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
      const options = { ...this.defaultSetting, ...setting };

      // method registrations
      controlKeys.forEach(key => {
        if (key === 'alias' && !alias) throw new ReferenceError('Parameter "alias" have to be provided.');
        const path = key === 'alias' ? alias : route;
        const method = key === 'alias' ? 'get' : key.toLowerCase();
        this.router[method](path, getMiddlewareChain(controller[key], this.queue, options));
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
