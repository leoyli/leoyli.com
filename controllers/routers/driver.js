const Router = require('express').Router;
const { _md } = require('../middleware/plugins');
const { _fn } = require('../helpers');
const renderer = require('../views/renderer');



/**
 * wrap asyncfunctions with an error catcher// note: `asyncWrapper` may be generalized
 * @param {(array|function)} fn             - fn may be wrapped
 * @return {array}                          - task is triggered only when keyword 'async' is met
 */
function asyncWrapper(fn) {
    const wrapAsync = fn => (req, res, next) => fn(req, res, next).catch(next);
    if (!_fn.object.checkNativeBrand(fn, 'Array')) fn = [fn];
    return fn.map(fn => _fn.object.checkNativeBrand(fn, 'AsyncFunction') ? wrapAsync(fn) : fn);
}


/**
 * normalize into a method array in the anti-alphabetical order
 * @param {(object|function)} controller    - controller may be extracted
 * @param {(string|regex)} [alias]          - alias to be watched
 * @param {(string|array)} [method]         - default: keys of controller{object} || `get`
 * @return {array}                          - ordering of the result is important ('alias' must be met after 'get')
 */
function getMethods({ controller, alias, method }) {
    const $method = method
        ? _fn.object.checkNativeBrand(method, 'String') ? [method] : method
        : _fn.object.checkNativeBrand(controller, 'Object') ? Object.keys(controller) : ['get'];
    if (alias && $method.indexOf('alias') === -1) $method.push('alias');
    return $method.sort().reverse();
}


/**
 * stack a queue from settings
 * @param {string} [query]                  - accept case insensitive `req.query` (by Proxy)    default: insensitive
 * @param {boolean} [authorized]            - accept only authenticated? (load 4 fns)           default: false
 * @param {boolean} [authenticated]         - accept only authorized? (load 5 fns)              default: false
 * @param {boolean} [crawler]               - accept crawlers? (load 1 fn)                      default: true
 * @param {string} [title]                  - title tag name
 * @param {object} [titleOption]            - title tagging options (see _md.setTitleTag())
 * @param {string} [method]                 - method to be watched
 * @return {Array}                          - ordering of the result is important
 */
function getMiddlewareQueue({ query, authorized, authenticated, crawler, title, titleOption } = {}, method) {
    const queue = [];

    if (query !== 'sensitive') queue.push(_md.caseInsensitiveQuery);
    if (authorized === true) queue.push(..._md.isAuthorized);
    else if (authenticated === true) queue.push(..._md.isSignedIn);
    else if (crawler === false) queue.push(_md.doNotCrawled);
    if (title) queue.push(_md.setTitleTag(title, titleOption));
    return queue;
}


/**
 * stack a queue from controllers with normalization
 * @param {(array|function)} controller     - controller to be stacked
 * @param {string} [method]                 - method to be used to extract property of the controller
 * @return {array}                          - if no matched method, the controller would just be normalized to an array
 */
function getControllerQueue(controller, method) {
    if (controller[method]) controller = controller[method];
    return _fn.object.checkNativeBrand(controller, 'Array') ? controller : [controller];
}


/**
 * stack a queue with a given template when HTTP method is 'get'
 * @param {string} [template]               - template file path
 * @param {string} method                   - method to be watched
 * @return {array}                          - task is triggered only when the method is 'alias' or 'get'
 */
function getViewRenderQueue({ template } = {}, method) {
    return (['get', 'alias'].indexOf(method) > -1) && template ? [renderer.postRenderer(template)] : [];
}


/**
 * schematize for assigning routing rules
 * @constructor
 * @param {array} rules                     - an array that contains routing rule objects
 * @param {object} [option]                 - (see express.Router() API)
 */
function RouterHub(rules, option) {
    this.rules = rules;
    this.router = new Router(option);
}

RouterHub.prototype.use = function(fn) {
    return this.router.use(fn);
};

RouterHub.prototype.run = function() {
    this.rules.forEach(({ route, alias, controller, method, settings }) => {
        getMethods({ alias, controller, method }).forEach(method => {
            this.router[(method === 'alias') ? 'get' : method](...asyncWrapper([
                (method === 'alias') ? alias : route,           // path
                ...getMiddlewareQueue(settings, method),        // middleware(plug-ins)
                ...getControllerQueue(controller, method),      // controller
                ...getViewRenderQueue(settings, method)         // view
            ]));
        });
    });
    return this.router;
};



// module export
module.exports = { RouterHub, _test: {
    asyncWrapper, getMethods, getMiddlewareQueue, getControllerQueue, getViewRenderQueue, RouterHub }};
