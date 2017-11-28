function RouterHub(rules, option) {
    this.rules = rules;
    this.router = require('express').Router(option);
    this.use = (middleware) => this.router.use(middleware);
}

RouterHub.prototype.activate = function() {
    const render = require('./render');

    this.rules.forEach(({ route, controller, method, settings = {} }) => {  // todo: type -> control return data type; auth -> use authentication
        if (typeof controller === 'function') controller = [controller];
        if (!method) method = (Array.isArray(controller)) ? ['get'] : Object.keys(controller);
        if (method instanceof String) method = [method];

        method.forEach(method => {
            const { _md } = require('./middleware');
            const sequence = [route];
            if (settings.crawler === false) sequence.push(_md.doNotCrawled);
            if (settings.authentication === true) sequence.push(_md.isSignedIn);
            if (settings.authorization === true) sequence.push(_md.isAuthorized);
            if (settings.title) sequence.push(_md.setTitleTag(settings.title, settings.setTitle));

            sequence.push(Array.isArray(controller) ? controller : controller[method]); // tofix: test if CURD method existed
            if (method === 'get' && settings.template) sequence.push(render.post(settings.template));
            this.router[method](...sequence);
        })
    });

    this.use(render.errorHandler);
    return this.router;
};



module.exports = RouterHub;
