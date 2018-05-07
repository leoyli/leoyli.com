const { Router } = require('express');


// modules
const { _M_ } = require('../modules/');
const { _U_ } = require('../utilities/');
const { exportHTML, exportJSON, rendererSymbols } = require('../handlers/exporter');
const { BrowserReceptor, APIReceptor } = require('../handlers/receptor');


// helpers
/**
 * stack a queue from setting options
 * @param {object} options                  - setting options
 * @return {array}                          - ordering of the result is important
 */
const getProcessingPipes = (options) => {
  const queue = [];
  if (options.sensitive       !== true)     queue.push(_M_.caseInsensitiveProxy);
  if (options.authorization   === true)     queue.push(..._M_.isAuthorized);
  if (options.authentication  === true)     queue.push(..._M_.isSignedIn);
  if (options.crawler         === false)    queue.push(_M_.noCrawlerHeader);
  if (options.cache           === false)    queue.push(_M_.noStoreCacheHeader);
  return queue;
};


/**
 * compose an ordered, unique middleware firing chain
 * @param {string} mode                     - routing mode
 * @param {array|function} main             - the main controlling logic
 * @param {object} hooker                   - pre/post hooked middleware on the device
 * @param {object} options                  - router settings
 * @return {array}
 */
const getMiddlewareChain = (mode, main, hooker, options) => {
  const pipeline = getProcessingPipes(options);
  const exporter = mode !== 'api' ? exportHTML(options) : exportJSON;
  const titleModifier = mode !== 'api' && options.title ? _M_.modifyHTMLTitleTag(options.title) : [];
  const chain = [pipeline, hooker.pre, titleModifier, main, hooker.post, exporter];
  return _U_.express.wrapAsync([...new Set([].concat(...chain))]);
};


// main
/**
 * a routing device takes input setting outputting Express.js routing objects
 * @constructor
 * @param {array} rules = []                - an array that contains routing rule objects
 * @param {object} [option]                 - (see express.Router() API)
 */
class Device {
  constructor(rules = [], option) {
    this._base = new Router(option);
    this._hook = { pre: [], post: [] };
    this.rules = _U_.object.freezeDeep(rules);
    this.defaultSetting = {};
  }

  static load(mode, cluster) {
    const router = new Router('/');
    router.use(mode !== 'api' ? BrowserReceptor : APIReceptor);
    cluster.forEach(([path, device]) => router.use(path, device.exec(mode)));
    return router;
  }

  static get renderer() {
    return rendererSymbols;
  }

  get setting() {
    return new Proxy(this.defaultSetting, {
      set: (defaultSetting, option, value) => {
        if (option === 'title') this._hook.pre.push(_M_.modifyHTMLTitleTag(value));
        else defaultSetting[option] = value;
        return true;
      },
    });
  }

  set setting(options) {
    Object.keys(options).forEach(key => {
      this.setting[key] = options[key];
    });
  }

  hook(position, fn) {
    this._hook[position].push(...(_U_.object.checkToStringTag(fn, 'Array') ? fn : [fn]));
    return this;
  }

  use(...arg) {
    this._base.use(...arg);
    return this;
  }

  exec(mode) {
    const router = new Router('/').use(this._base);

    // router registrations
    const matrix = this.rules.filter(({ setting = {} }) => (mode.toLowerCase() === 'api' ? setting.servingAPI : true));
    matrix.forEach(({ route, alias, controller, setting }) => {
      const controlKeys = Object.keys(controller).sort();
      const options = { ...this.defaultSetting, ...setting };

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
}


// exports
module.exports = {
  Device,
  [Symbol.for('UNIT_TEST')]: {
    Device,
    getProcessingPipes,
    getMiddlewareChain,
  },
};
