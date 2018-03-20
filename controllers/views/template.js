const { _U_ } = require('../utilities/');
const { _M_ } = require('../middleware/plugins');



// gateway
const templateHandler = ($template, $handler) => (req, res) => {
    const { template, list, post, meta } = req.session.chest ? req.session.chest : {};
    const _template = (template || $template).replace(/\/:([a-z0-9-$]+)$/i, (match, key) => `/${req.params[key]}`);
    delete req.session.chest;

    switch ($handler) {
        case 'posts':
            return handler.postsHandler(_template, list, post, meta)(req, res);
        default:
            return res.render(_template);
    }
};


// handlers
const handler = {};

handler.postsHandler = (template, $$LIST, $$POST, $$META) => (req, res) => {
    if (!$$LIST && !$$POST) throw new _U_.error.HttpError(404);

    // title-tag
    if ($$POST && $$POST.title) _M_.setTitleTag($$POST.title, { root: true })(req, res);

    // pagination
    if ($$META) {
        const paginatedURL = `${res.locals.$$VIEW.route}?num=${$$META.num}&page='`;
        if ($$META.now > 1)             res.locals.$$VIEW.prev = paginatedURL + ($$META.now - 1);
        if ($$META.now < $$META.end)    res.locals.$$VIEW.next = paginatedURL + ($$META.now + 1);
    }

    return res.render(template, { $$LIST, $$POST, $$META });
};



// exports
module.exports = templateHandler;
