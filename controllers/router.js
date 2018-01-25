const Router = require('express').Router;
const { _md } = require('./modules/core');
const render = require('./render');


/**
 * check the type of the object by its native brand
 * @param {object} obj
 * @param {string} checkValue
 * @return {boolean}
 */
function checkNativeBrand(obj, checkValue) {
    checkValue = checkValue[0].toUpperCase() + checkValue.slice(1);
    return Object.prototype.toString.call(obj).slice(8, -1) === checkValue;
}


/**
 * wrap async-functions with error catcher
 * @param {array||function} queue
 * @return {array}
 */
function asyncWrapper(queue) {
    const wrapAsync = fn => (req, res, next) => fn(req, res, next).catch(next);
    if (!checkNativeBrand(queue, 'Array')) queue = [queue];
    return queue.map(fn => checkNativeBrand(fn, 'AsyncFunction') ? wrapAsync(fn) : fn);
}


/**
 * normalize into a method array sorted anti-alphabetically
 * @param {string||regex} alias         - (optional) alternative routing path; default: `null`
 * @param {string||array} method        - (optional) HTTP methods; default: keys of controller{object} || `get`
 * @param {object||function} controller - controller function or functions collection
 * @return {array}
 */
function getMethods({ alias, method, controller }) {
    method = method
        ? checkNativeBrand(method, 'String') ? [method] : method
        : checkNativeBrand(controller, 'Object') ? Object.keys(controller) : ['get'];
    if (alias) method.push('alias');
    return method.sort().reverse();     // note: .sort().revers() so 'alias' is placed behind 'get'
}


/**
 * stack queues from settings
 * @param {string} title                - (optional) title tag name; default: `null`
 * @param {object} titleOption          - (optional) title tagging options (see _md.setTitleTag()); default: `null`
 * @param {boolean} crawler             - (optional) crawlers?; default: `false`
 * @param {boolean} authentication      - (optional) authorization?; default: `false`
 * @param {boolean} authorization       - (optional) authentication?; default: `false`
 * @return {Array}
 */
function middlewareQueue({ title, titleOption, crawler, authentication, authorization } = {}) {
    const queue = [];
    if (title) queue.push(_md.setTitleTag(title, titleOption));
    if (crawler === false) queue.push(_md.doNotCrawled);
    if (authorization === true) queue.push(_md.isAuthorized);
    if (authorization !== true && authentication === true) queue.push(_md.isSignedIn);
    return queue;
}


/**
 * stack queues from controllers with normalization
 * @param {array||function} controller
 * @param {string} method
 * @return {array}
 */
function controllerQueue(controller, method) {
    if (controller[method]) controller = controller[method];
    return checkNativeBrand(controller, 'Array') ? controller : [controller];
}


/**
 * stack queues if giving template and HTTP method is 'get'
 * @param {string} template
 * @param {string} method
 * @return {array}
 */
function viewRenderQueue({ template } = {}, method) {
    return (method === 'get' || 'alias') && template ? [render.post(template)] : [];
}

/**
 * schematize for assigning routing rules
 * @constructor
 * @param {array} rules             - array contains routing rule objects
 * @param {object} option           - (see express.Router() API)
 * @return this.router
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
                (method === 'alias') ? alias : route,
                ...middlewareQueue(settings),
                ...controllerQueue(controller, method),
                ...viewRenderQueue(settings, method)
            ]));
        });
    });
    debugger;
    // post-attached handler
    this.use(render.errorHandler);
    return this.router;
};



// module export
module.exports = RouterHub;
