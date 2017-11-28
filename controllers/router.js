const { _md } = require('../controllers/middleware');



const routerHub = {
    Rule: function(file) {
        const router = require('express').Router();
        const render = require('./render');

        file.forEach(({ route, method, controller, template, option = {} }) => {  // todo: type -> control return data type; auth -> use authentication
            const { setHeader = [] } = option;
            if (option.crawl === false) setHeader.push(_md.doNotCrawled);

            if (!(method instanceof Array)) method = [method];
            if (typeof controller === 'function') controller = [controller];
            method.forEach(method => {
                const rule = [route];
                if (option.authentication === true) rule.push(_md.isSignedIn);
                if (option.authorization === true) rule.push(_md.isAuthorized);
                if (option.title) rule.push(_md.setTitleTag(option.title, option.setTitle));
                if (controller) rule.push(Array.isArray(controller) ? controller : controller[method]);
                if (setHeader.length > 0) rule.push(setHeader);
                if (method === 'get' && template) rule.push(render.post(template));
                router[method](...rule);
            })
        });

        router.use(render.errorHandler);
        return router;
    },
};



module.exports = routerHub;
