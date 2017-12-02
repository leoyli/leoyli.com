const Router = require('express').Router;



// constructor
function RouterHub(rules, option) {
    this.rules = rules;
    this.router = new Router(option);
}


RouterHub.prototype.activate = function() {
    const checkNativeBrand = (obj) => Object.prototype.toString.call(obj).slice(8, -1);
    const wrapAsync = fn => (req, res, next) => fn(req, res, next).catch(next);
    const render = require('./render');

    this.rules.forEach(({ route, controller, method, settings = {} }) => {
        // normalize into a method array
        if (!method) method = (checkNativeBrand(controller) === 'Object') ? Object.keys(controller) : ['get'];
        if (checkNativeBrand(method) === 'String') method = [method];

        method.forEach(method => {
            const queueStack = [route];

            // stack queues by settings
            const { _md } = require('./modules/core');
            if (settings.crawler === false) queueStack.push(_md.doNotCrawled);
            if (settings.authentication === true) queueStack.push(_md.isSignedIn);
            if (settings.authorization === true) queueStack.push(_md.isAuthorized);
            if (settings.title) queueStack.push(_md.setTitleTag(settings.title, settings.setTitle));

            // normalize controller into a queue array
            let queue = controller[method] ? controller[method] : controller;
            if (checkNativeBrand(queue) !== 'Array') queue = [queue];

            // check if need `wrapAsync` and stack the queue
            if (queue.length > 0) queueStack.push(...queue.map(fn => {
                return (checkNativeBrand(fn) === 'AsyncFunction') ? wrapAsync(fn) : fn;
            }));

            // stack the view renderer
            if (method === 'get' && settings.template) queueStack.push(render.post(settings.template));
            this.router[method](...queueStack);
        });
    });

    // post-used middleware
    this.use(render.errorHandler);
    return this.router;
};


RouterHub.prototype.use = function(middleware) {
    return this.router.use(middleware);
};



// module export
module.exports = RouterHub;
