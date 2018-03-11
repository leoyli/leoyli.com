const Router = require('express').Router;
const templateHandler = require('../views/template');
const { _M_ } = require('../middleware/plugins');
const { _U_ } = require('../utilities/');



/**
 * a routing device takes input settings outputting Express.js routing objects
 * @constructor
 * @param {array} rules                     - an array that contains routing rule objects
 * @param {object} [option]                 - (see express.Router() API)
 */
class Device {
    constructor(rules, option) {            // todo: [private] make these private once JS supports
        this._router = new Router(option);
        this._queue = { pre: [], post: [] };
        this._rules = rules;
    }

    pre(fn) {
        if(!Array.isArray(fn)) fn = [fn];
        this._queue.pre.push(...fn);
    }

    post(fn) {
        if(!Array.isArray(fn)) fn = [fn];
        this._queue.post.push(...fn);
    }

    run() {
        this._queue.pre.map(queue => this._router.use(queue));                          // universal pre-middleware
        this._rules.forEach(({route, alias, controller, method, settings}) => {
            stackHttpMethods({alias, controller, method}).forEach(method => {
                this._router[(method === 'alias') ? 'get' : method](...asyncWrapper([
                    (method === 'alias') ? alias : route,                               // router path
                    ...loadRoutePlugins(settings    , method),                          // middleware plugins
                    ...loadMainControls(controller  , method),                          // router controller
                    ...loadViewRenderer(settings    , method)                           // template handler
                ]));
            });
        });
        this._queue.post.map(queue => this._router.use(queue));                         // universal post-middleware
        return this._router;
    }
}



// ==============================
//  COMPONENTS
// ==============================
/**
 * wrap asyncfunctions with an error catcher// note: `asyncWrapper` may be generalized
 * @param {(array|function)} fn             - fn may be wrapped
 * @return {array}                          - task is triggered only when keyword 'async' is met
 */
function asyncWrapper(fn) {
    const wrapAsync = fn => (req, res, next) => fn(req, res, next).catch(next);
    if (!_U_.object.checkNativeBrand(fn, 'Array')) fn = [fn];
    return fn.map(fn => _U_.object.checkNativeBrand(fn, 'AsyncFunction') ? wrapAsync(fn) : fn);
}


/**
 * normalize into a method array in the anti-alphabetical order
 * @param {(object|function)} controller    - controller may be extracted
 * @param {(string|regex)} [alias]          - alias to be watched
 * @param {(string|array)} [method]         - default: keys of controller{object} || `get`
 * @return {array}                          - ordering of the result is important ('alias' must be met after 'get')
 */
function stackHttpMethods({ controller, alias, method }) {
    const $method = method
        ? _U_.object.checkNativeBrand(method, 'String') ? [method] : method
        : _U_.object.checkNativeBrand(controller, 'Object') ? Object.keys(controller) : ['get'];
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
 * @param {object} [titleOption]            - title tagging options (see _M_.setTitleTag())
 * @param {string} [method]                 - method to be watched
 * @return {Array}                          - ordering of the result is important
 */
function loadRoutePlugins({ query, authorized, authenticated, crawler, title, titleOption } = {}, method) {
    const queue = [];
    if (query !== 'sensitive') queue.push(_M_.caseInsensitiveQuery);
    if (authorized === true) queue.push(..._M_.isAuthorized);
    else if (authenticated === true) queue.push(..._M_.isSignedIn);
    else if (crawler === false) queue.push(_M_.doNotCrawled);
    if (title) queue.push(_M_.setTitleTag(title, titleOption));
    return queue;
}


/**
 * stack a queue from controllers with normalization
 * @param {(array|function)} controller     - controller to be stacked
 * @param {string} [method]                 - method to be used to extract property of the controller
 * @return {array}                          - if no matched method, the controller would just be normalized to an array
 */
function loadMainControls(controller, method) {
    if (controller[method]) controller = controller[method];
    return _U_.object.checkNativeBrand(controller, 'Array') ? controller : [controller];
}


/**
 * stack a queue with a given template when HTTP method is 'get'
 * @param {string} [template]               - template file path
 * @param {string} method                   - method to be watched
 * @return {array}                          - task is triggered only when the method is 'alias' or 'get'
 */
function loadViewRenderer({ template } = {}, method) {
    return (['get', 'alias'].indexOf(method) > -1) && template ? [templateHandler(template)] : [];
}



// exports
module.exports = { Device, _test: { Device,
        asyncWrapper, stackHttpMethods, loadRoutePlugins, loadMainControls, loadViewRenderer }};
