const { Router } = require('express');


// modules
const { _M_ } = require('../modules/');
const { _U_ } = require('../utilities/');
const { exportHTML, exportJSON, rendererSymbols } = require('../handlers/exporter');
const { initialReceptor, browserReceptor, APIReceptor } = require('../handlers/receptor');


// helpers
/**
 * stack a queue from setting options
 * @param {object} option                   - setting options
 * @return {array}                          - ordering of the result is important
 */
const getProcessingPipes = (option) => {
  const queue = [];
  if (option.sensitive       !== true)     queue.push(_M_.caseInsensitiveQueryProxy);
  if (option.authorization   === true)     queue.push(..._M_.isAuthorized);
  if (option.authentication  === true)     queue.push(..._M_.isSignedIn);
  if (option.crawler         === false)    queue.push(_M_.noCrawlerHeader);
  if (option.cache           === false)    queue.push(_M_.noStoreCacheHeader);
  return [...new Set(queue)];
};


/**
 * compose an ordered, unique middleware firing chain
 * @param {string} mode                     - routing mode
 * @param {array|function} main             - the main controlling logic
 * @param {object} hooker                   - pre/post hooked middleware on the device
 * @param {object} option                   - router settings
 * @return {array}
 */
const getMiddlewareChain = (mode, main, hooker, option) => {
  const pipeline = getProcessingPipes(option);
  const exporter = mode === 'html' ? exportHTML(option) : exportJSON(option);
  const titleModifier = mode === 'html' && option.title ? _M_.modifyHTMLTitleTag(option.title) : [];
  const chain = [pipeline, hooker.pre, titleModifier, main, hooker.post, exporter];
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
        if (option === 'title') this._hook.pre = this._hook.pre.concat(_M_.modifyHTMLTitleTag(value));
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
   * @param {string} mode
   * @return {function}                     - middleware assembly (device)
   */
  exec(mode) {
    if (!['html', 'api'].includes(mode)) throw ReferenceError(`Received ${mode} as an invalid mode.`);
    const matrix = this.rules.filter(({ setting = {} }) => (mode.toLowerCase() === 'api' ? setting.servingAPI : true));

    // create router
    const router = new Router(this._baseOption);
    if (this._baseStack.size) router.use(...this._baseStack);

    // register router
    matrix.forEach(({ route, alias, controller, setting = {} }) => {
      const methodKeys = setting.method ? [setting.method] : Object.keys(controller).sort().reverse();
      const options = { ...this.setting, ...setting };
      for (let i = methodKeys.length - 1, method = methodKeys[i]; i > -1; method = methodKeys[i -= 1]) {
        if (method === 'alias' && !alias) throw new ReferenceError('Parameter "alias" have to be provided.');
        const path = `${method === 'alias' ? alias : route}`;
        const httpMethod = method === 'alias' ? 'get' : method.toLowerCase();
        router[httpMethod](path, getMiddlewareChain(mode.toLowerCase(), controller[method], this._hook, options));
      }
    });

    // expose router
    return router;
  }

  /**
   * assemble middleware from the device cluster
   * @param {string} mode                   - assemble mode, accept 'html' or 'api'
   * @param {[string, object]} clusterPairs - routing path and device pair
   * @return {function}                     - middleware assembly (device cluster)
   */
  static exec(mode, clusterPairs) {
    const router = new Router({});
    router.use(initialReceptor);
    router.use(mode === 'html' ? browserReceptor : APIReceptor);
    clusterPairs.forEach(([path, device]) => router.use(path, device.exec(mode)));
    return router;
  }

  /**
   * reference of available renderer Symbols
   * @return {Symbol}                       - shortcut for accessing renderer symbols
   */
  static get renderer() {
    return rendererSymbols;
  }
}


// exports
module.exports = {
  Device,
};

Object.defineProperty(module.exports, Symbol.for('__TEST__'), {
  value: {
    getProcessingPipes,
    getMiddlewareChain,
    ...module.exports,
  },
});
