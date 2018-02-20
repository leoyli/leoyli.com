const { _md } = require('../middleware/plugins');
const errorClasses = require('../errors');
module.exports = exports = {};



// render post
exports.postRenderer = (template, post, meta) => async (req, res, next) => {
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

    if ($post === null) throw new errorClasses.HttpError(404);
    else return res.render($template, { meta: $meta, post: $post });
};



// error handler
const terminal = {};
exports.errorHandler = (err, req, res, next) => {     // todo: error handler separations
    if (['dev', 'test'].indexOf(process.env.NODE_ENV) !== -1) console.log(err);
    debugger;
    switch (err.constructor) {
        default:
            return res.render('./theme/error', { err });
        case errorClasses.MongoError:
            return terminal.MongoError(err, req, res, next);
        case errorClasses.AccountError:
            return terminal.AccountError(err, req, res, next);
        case errorClasses.HttpError:
            return terminal.HttpError(err, req, res, next);
    }
};


terminal.MongoError = (err, req, res, next) => {
    if (err.code === 11000) req.flash('error', 'This username is not available.');
    return res.redirect('back');
};


terminal.AccountError = (err, req, res, next) => {
    if (err.name === 'UserExistsError') {
        req.flash('error', 'This email have been registered.');
    } else {
        req.flash('error', err.message);
    } return res.redirect('back');
};


terminal.HttpError = (err, req, res, next) => {
    return _md.doNotCrawled(req, res, () => {
        return res.status(err.status).render('./theme/error', { err });    // todo: added http404.dot
    });
};
