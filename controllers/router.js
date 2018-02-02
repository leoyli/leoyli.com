const Router = require('express').Router;
const { _md } = require('./modules/core');
const render = require('./render');


/**
 * check the native brand(type) of objects  // note: `checkNativeBrand` can be generalized
 * @param {object} obj                      - object to be checked
 * @param {string} [name=null]              - name to be matched (case insensitive)
 * @return {(boolean|string)}               - if no name given, the brand name of the object would be returned
 */
function checkNativeBrand(obj, name) {
    if (name) return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase() === name.toLowerCase();
    else return Object.prototype.toString.call(obj).slice(8, -1);
}


/**
 * wrap asyncfunctions with an error catcher// note: `asyncWrapper` can be generalized
 * @param {(array|function)} fn             - fn may be wrapped
 * @return {array}                          - task is triggered only when keyword 'async' is met
 */
function asyncWrapper(fn) {
    const wrapAsync = fn => (req, res, next) => fn(req, res, next).catch(next);
    if (!checkNativeBrand(fn, 'Array')) fn = [fn];
    return fn.map(fn => checkNativeBrand(fn, 'AsyncFunction') ? wrapAsync(fn) : fn);
}


/**
 * normalize into a method array in the anti-alphabetical order
 * @param {(object|function)} controller    - controller may be extracted
 * @param {(string|regex)} [alias=null]     - alias to be watched
 * @param {(string|array)} [method]         - default: keys of controller{object} || `get`
 * @return {array}                          - ordering of the result is important ('alias' must be met after 'get')
 */
function getMethods({ controller, alias, method }) {
    method = method
        ? checkNativeBrand(method, 'String') ? [method] : method
        : checkNativeBrand(controller, 'Object') ? Object.keys(controller) : ['get'];
    if (alias && method.indexOf('alias') === -1) method.push('alias');
    return method.sort().reverse();
}


/**
 * stack a queue from settings
 * @param {boolean} [authentication=false]  - accept only authorized? (load 5 fns)
 * @param {boolean} [authorization=false]   - accept only authenticated? (load 4 fns)
 * @param {boolean} [crawler=false]         - accept crawlers? (load 1 fn)
 * @param {string} [title=null]             - title tag name
 * @param {object} [titleOption=null]       - title tagging options (see _md.setTitleTag())
 * @param {string} [method=null]            - method to be watched
 * @return {Array}                          - ordering of the result is important
 */
function getMiddlewareQueue({ authorization, authentication, crawler, title, titleOption } = {}, method) {
    const queue = [];
    if (authorization === true) queue.push(..._md.isAuthorized);
    else if (authentication === true) queue.push(..._md.isSignedIn);
    else if (crawler === false) queue.push(_md.doNotCrawled);
    if (title) queue.push(_md.setTitleTag(title, titleOption));
    return queue;
}


/**
 * stack a queue from controllers with normalization
 * @param {(array|function)} controller     - controller to be stacked
 * @param {string} [method=null]            - method to be used to extract property of the controller
 * @return {array}                          - if no matched method, the controller would just be normalized to an array
 */
function getControllerQueue(controller, method) {
    if (controller[method]) controller = controller[method];
    return checkNativeBrand(controller, 'Array') ? controller : [controller];
}


/**
 * stack a queue with a given template when HTTP method is 'get'
 * @param {string} [template]               - template file path
 * @param {string} method                   - method to be watched
 * @return {array}                          - task is triggered only when the method is 'alias' or 'get'
 */
function getViewRenderQueue({ template } = {}, method) {
    return (['get', 'alias'].indexOf(method) > -1) && template ? [render.post(template)] : [];
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

    // post-attached handler
    this.use(render.errorHandler);
    return this.router;
};



// module export
module.exports = { RouterHub, _test: {
    checkNativeBrand, asyncWrapper, getMethods, getMiddlewareQueue, getControllerQueue, getViewRenderQueue, RouterHub }};
