const { _U_ } = require('../utilities/');
const { _M_ } = require('../middleware/plugins');



// gateway
const templateHandler = $template => (req, res) => {
    const { template, post, meta } = req.session.view ? req.session.view : {};
    delete req.session.view;

    if (post) return handler.postHandler(template || $template, post, meta)(req, res);
    else return res.render(template || $template);
};


// handlers
const handler = {};

handler.postHandler = (template, post, meta) => (req, res) => {
    // title-tag
    if (post && post.title !== undefined) _M_.setTitleTag(post.title, { root: true })(req, res);

    // pagination
    if (meta) {
        const urlBase = `${req.baseUrl}?num=${meta.num}&page='`;
        if (meta.now > 1)          res.locals._view.prev = urlBase + (meta.now - 1);
        if (meta.now < meta.end)  res.locals._view.next = urlBase + (meta.now + 1);
    }

    return res.render(template, { meta: meta, post: post });
};



// exports
module.exports = templateHandler;
