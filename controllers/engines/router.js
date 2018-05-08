const { Router } = require('express');


// modules
const { _M_ } = require('../modules/');
const { _U_ } = require('../utilities/');
const { exportHTML, exportJSON, rendererSymbols } = require('../handlers/exporter');
const { BrowserReceptor, APIReceptor } = require('../handlers/receptor');


// helpers
/**
 * stack a queue from setting options
 * @param {object} option                   - setting options
 * @return {array}                          - ordering of the result is important
 */
const getProcessingPipes = (option) => {
  const queue = [];
  if (option.sensitive       !== true)     queue.push(_M_.caseInsensitiveProxy);
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
  const exporter = mode !== 'api' ? exportHTML(option) : exportJSON;
  const titleModifier = mode !== 'api' && option.title ? _M_.modifyHTMLTitleTag(option.title) : [];
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
  constructor(rules = [], option) {
    this._base = new Router(option);
    this._hook = { pre: [], post: [] };
    this._setting = {};
    this.rules = _U_.object.freezeDeep(rules);
  }

  /**
   * getter of the Device setting, handling the setter duty via a Proxy
   * @return {object}                       - stored read-only device setting
   */
  get setting() {
    return new Proxy(this._setting, {
      set: (setting, option, value) => {
        if (option === 'title') this._hook.pre.push(_M_.modifyHTMLTitleTag(value));
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
   * @param fn                              - middleware to be shared
   * @return {Device}
   */
  use(fn) {
    this._base.use(fn);
    return this;
  }

  /**
   * middleware hooking (explicitly populating into individual routing method)
   * @param tag                             - position tag of the hook
   * @param fn                              - middleware to be staked
   * @return {Device}
   */
  hook(tag, fn) {
    if (['pre', 'post'].includes(tag)) this._hook[tag].push(...(_U_.string.checkToStringTag(fn, 'Array') ? fn : [fn]));
    return this;
  }

  /**
   * assemble middleware from the device
   * @param mode
   * @return {function}                     - middleware assembly (device)
   */
  exec(mode) {
    if (!['html', 'api'].includes(mode)) throw ReferenceError(`Received ${mode} as an invalid mode.`);
    const router = new Router('/').use(this._base);

    // router registrations
    const matrix = this.rules.filter(({ setting = {} }) => (mode.toLowerCase() === 'api' ? setting.servingAPI : true));
    matrix.forEach(({ route, alias, controller, setting }) => {
      const controlKeys = Object.keys(controller).sort();
      const options = { ...this.setting, ...setting };

      // method registrations
      controlKeys.forEach(key => {
        if (key === 'alias' && !alias) throw new ReferenceError('Parameter "alias" have to be provided.');
        const path = key === 'alias' ? alias : route;
        const method = key === 'alias' ? 'get' : key.toLowerCase();
        router[method](path, getMiddlewareChain(mode.toLowerCase(), controller[key], this._hook, options));
      });
    });

    return router;
  }

  /**
   * assemble middleware from the device cluster
   * @param {string} mode                   - assemble mode, accept 'html' or 'api'
   * @param {[string, object]} clusterPairs - routing path and device pair
   * @return {function}                     - middleware assembly (device cluster)
   */
  static exec(mode, clusterPairs) {
    const router = new Router('/');
    router.use(mode !== 'api' ? BrowserReceptor : APIReceptor);
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
  [Symbol.for('UNIT_TEST')]: {
    getProcessingPipes,
    getMiddlewareChain,
    Device,
  },
};
