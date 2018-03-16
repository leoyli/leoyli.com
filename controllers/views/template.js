const { _U_ } = require('../utilities/');
const { _M_ } = require('../middleware/plugins');



// gateway
const templateHandler = $template => (req, res) => {
    const { template, list, post, meta } = req.session._view ? req.session._view : {};
    delete req.session._view;

    if (req.baseUrl === '/posts' || req.path === '/stack/posts') {
        return handler.postHandler(template || $template, list, post, meta)(req, res);
    } else return res.render(template || $template);
};


// handlers
const handler = {};

handler.postHandler = (template, list, post, meta) => (req, res) => {
    if (!list && !post) throw new _U_.error.HttpError(404);

    // title-tag
    if (post && post.title) _M_.setTitleTag(post.title, { root: true })(req, res);

    // pagination
    if (meta) {
        const urlBase = `${req.baseUrl}?num=${meta.num}&page='`;
        if (meta.now > 1)           res.locals._view.prev = urlBase + (meta.now - 1);
        if (meta.now < meta.end)    res.locals._view.next = urlBase + (meta.now + 1);
    }

    return res.render(template, { list, post, meta });
};



// exports
module.exports = templateHandler;
