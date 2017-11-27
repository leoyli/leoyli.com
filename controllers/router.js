const { _pre } = require('../controllers/middleware');



const routerHub = {
    Rule: function(file) {
        const router = require('express').Router();
        const { _end } = require('../controllers/middleware');

        file.forEach(({ route, method, controller, template, option = {} }) => {  // todo: type -> control return data type; auth -> use authentication
            const { setHeader = [] } = option;
            if (option.crawl === false) setHeader.push(_pre.doNotCrawled);

            if (!(method instanceof Array)) method = [method];
            if (typeof controller === 'function') controller = [controller];
            method.forEach(method => {
                const rule = [route];
                if (option.authentication === true) rule.push(_pre.isSignedIn);
                if (option.authorization === true) rule.push(_pre.isAuthorized);
                if (option.title) rule.push(_pre.appendTitleTag(option.title));
                if (controller) rule.push(Array.isArray(controller) ? controller : controller[method]);
                if (setHeader.length > 0) rule.push(setHeader);
                if (method === 'get' && template) rule.push(_end.next.postRender(template));
                router[method](...rule);
            })
        });

        router.use(_end.error.clientError);
        return router;
    },
};



module.exports = routerHub;
