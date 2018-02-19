const { _md } = require('../middleware/plugins');
module.exports = exports = {};



// render post
exports.postRenderer = (template, post, meta) => async (req, res) => {
    const $template = await template ? template : req.session.view ? req.session.view.template : './theme/post/post';
    const $post = await post ? post : req.session.view ? req.session.view.post : [];
    const $meta = await meta ? meta : req.session.view ? req.session.view.meta : {};
    delete req.session.view;

    if ($post && $post.title !== undefined) _md.setTitleTag($post.title, { root: true })(req, res);
    if ($meta) {
        const urlBase = res.baseUrl + `?num=' + ${$meta.num} + '&page='`;
        if ($meta.now > 1)          res.locals._view.prev = urlBase + ($meta.now - 1);
        if ($meta.now < $meta.end)  res.locals._view.next = urlBase + ($meta.now + 1);
    }

    return res.render($template, { meta: $meta, post: $post });
};



// error handler
// branches
const branch = {};
branch.MongoError = (err, req, res, next) => {
    if (err.code === 11000) req.flash('error', 'This username is not available.');
    return res.redirect('back');
};


// core
exports.errorHandler = (err, req, res, next) => {     // todo: error handler separations
    const { MongoError } = require('mongodb');
    if (err instanceof MongoError) return branch.MongoError(err, req, res, next);

    if (err.name === 'UserExistsError') {
        req.flash('error', 'This email have been registered.');
        return res.redirect('back');
    }

    req.flash('error', err.toString());
    if (process.env.NODE_ENV === 'dev') console.log(err);
    if (process.env.NODE_ENV === 'test' && err) debugger;
    return res.redirect('/');
};
