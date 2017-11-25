const { _pre } = require('../controllers/middleware');



const routerHub = {
    Rule: function(file) {
        const router = require('express').Router();
        const { _end } = require('../controllers/middleware');

        file.forEach(({ path, method, controller, template, option = {} }) => {  // todo: type -> control return data type; auth -> use authentication
            const { setHeader = [] } = option;
            if (option.crawl === false) setHeader.push(_pre.doNotCrawled);

            if (!(method instanceof Array)) method = [method];
            method.forEach(method => {
                router[method](path, controller, setHeader, _end.next.postRender(template));
            })
        });

        router.use(_end.error.clientError);
        return router;
    },
};



module.exports = routerHub;
