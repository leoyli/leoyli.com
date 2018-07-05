const { Router } = require('express');


// modules
const { _M_ } = require('../modules/');
const { _U_ } = require('../../utilities/');


// helpers
/**
 * stack a queue from setting options
 * @param {object} option                   - setting options
 * @return {array}                          - ordering of the result is important
 */
const getRouterPlugins = (option) => {
  const queue = [];
  if (option.sensitive !== true) queue.push(_M_.caseInsensitiveQueryProxy);
  if (option.crawler === false) queue.push(_M_.noCrawlerHeader);
  if (option.cache === false) queue.push(_M_.noStoreCacheHeader);
  if (option.authentication === true) queue.push(_M_.JWTAuthentication);
  return [...new Set(queue)];
};


/**
 * compose an ordered, unique middleware firing chain
 * @param {object} hooker                   - pre/post hooked middleware on the device
 * @param {array|function} controller       - the main controlling logic
 * @param {object} option                   - router settings
 * @return {array}
 */
const getRouterStacks = (hooker, controller, option) => {
  const plugins = getRouterPlugins(option);
  const chain = [plugins, hooker.pre, controller, hooker.post];
  return _U_.express.wrapAsync([...new Set([].concat(...chain))]);
};


class Device {
  /**
   * construct a routing device contains information and methods in assembling routing middleware
   * @constructor
   * @param {array} rules = []              - an array that contains routing rule objects
   * @param {object} [option]               - (see express.Router() API)
   */
  constructor(rules = [], option = {}) {
    this._baseOption = _U_.object.freezeDeep(option);
    this._baseStack = new Set();
    this._setting = {};
    this._hook = { pre: [], post: [] };
    this.rules = _U_.object.freezeDeep(rules);
  }

  /**
   * getter of the Device setting, handling the setter duty via a Proxy
   * @return {object}                       - stored read-only device setting
   */
  get setting() {
    return new Proxy(this._setting, {
      set: (setting, option, value) => {
        if (option === 'title') this._hook.pre = this._hook.pre.concat(_M_.titleTagModifier(value));
        else setting[option] = value;
        return true;
      },
    });
  }

  /**
   * setter of the Device setting, triggering a series of redirection of its getter pair
   * @param {object} options                - device specific setting
   */
  set setting(options) {
    Object.keys(options).forEach(key => {
      this.setting[key] = options[key];
    });
  }

  /**
   * middleware attaching (populating upon the device level, spreading on the whole route path afterward)
   * @param {function} fn                   - middleware to be shared
   * @return {Device}
   */
  use(fn) {
    this._baseStack.add(fn);
    return this;
  }

  /**
   * middleware hooking (explicitly populating into individual routing method)
   * @param {string} tag                    - position tag of the hook
   * @param {function|[function]} fn        - middleware to be staked
   * @return {Device}
   */
  hook(tag, fn) {
    if (['pre', 'post'].includes(tag)) this._hook[tag] = this._hook[tag].concat(fn);
    return this;
  }

  /**
   * assemble middleware from the device
   * @return {function}                     - middleware assembly (device)
   */
  exec() {
    // create router
    const router = new Router(this._baseOption);
    if (this._baseStack.size) router.use(...this._baseStack);

    // register router
    this.rules.forEach(({ path, controller, secure, setting }) => {
      const methodKeys = Object.keys(controller).sort().reverse();
      const option = { ...this.setting, ...setting };
      for (let i = methodKeys.length - 1, method = methodKeys[i]; i > -1; method = methodKeys[i -= 1]) {
        const pathOption = { ...option, authentication: secure === undefined ? method.toLowerCase() !== 'get' : secure };
        router[method.toLowerCase()](path, getRouterStacks(this._hook, controller[method], pathOption));
      }
    });

    // expose router
    return router;
  }

  /**
   * assemble middleware from the device config clusters
   * @param {[string, object]} config       - routing path and device pair
   * @return {function}                     - middleware assembly (device cluster)
   */
  static assemble(config) {
    const router = new Router({});
    router.use(_M_.CORSHeaders);
    config.forEach(([path, device]) => router.use(path, device.exec()));
    router.use(_M_.JSONResponseHandler);
    return router;
  }
}


// exports
module.exports = {
  Device,
};

Object.defineProperty(module.exports, Symbol.for('__TEST__'), {
  value: {
    getRouterPlugins,
    getRouterStacks,
    ...module.exports,
  },
});
