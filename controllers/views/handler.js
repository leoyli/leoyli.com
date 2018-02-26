const { _U_ } = require('../utilities/');
const { _M_ } = require('../middleware/plugins');
module.exports = exports = {};



// ==============================
//  TEMPLATE HANDLER
// ==============================
// post handler
exports.postHandler = (template, post, meta) => async (req, res, next) => {
    const $template = await template ? template : req.session.view ? req.session.view.template : './theme/post/post';
    const $post = await post ? post : req.session.view ? req.session.view.post : [];
    const $meta = await meta ? meta : req.session.view ? req.session.view.meta : {};
    delete req.session.view;

    if ($post && $post.title !== undefined) _M_.setTitleTag($post.title, { root: true })(req, res);
    if ($meta) {
        const urlBase = res.baseUrl + `?num=' + ${$meta.num} + '&page='`;
        if ($meta.now > 1)          res.locals._view.prev = urlBase + ($meta.now - 1);
        if ($meta.now < $meta.end)  res.locals._view.next = urlBase + ($meta.now + 1);
    }

    if ($post === null) throw new _U_.error.HttpError(404);
    else return res.render($template, { meta: $meta, post: $post });
};



// ==============================
//  ERROR HANDLER
// ==============================
const terminal = {};

// gateway
exports.errorHandler = (err, req, res, next) => {     // todo: error handler separations
    if (['dev', 'test'].indexOf(process.env.NODE_ENV) !== -1) console.log(err.stack);
    if (_U_.error.hasOwnProperty(err.name) && terminal[err.name]) {
        return terminal[err.name](err, req, res, next);
    } else return res.render('./theme/error', { err });
};


// terminal
terminal.AccountError = (err, req, res, next) => {
    switch (err.from) {
        case 'UserExistsError':
            req.flash('error', 'This email have been used.');
            break;
        case 'ValidationError':
            req.flash('error', err.message);
            break;
        case 'BulkWriteError':
            return terminal.MongoError(err, req, res, next);
        default:
            req.flash('error', err.message);
    }

    return res.redirect('back');
};

terminal.MongoError = (err, req, res, next) => {
    if (err.code === 11000) req.flash('error', 'This username is not available.');
    return res.redirect('back');
};

terminal.HttpError = (err, req, res, next) => {
    return _M_.doNotCrawled(req, res, () => {
        return res.status(err.status).render('./theme/error', {err});
    });
};

terminal.TemplateError = (err, req, res, next) => {
    return _M_.doNotCrawled(req, res, () => {
        // todo: log the message and call the admin
        // todo: guidance for the client
        return res.status(500).send(`<h1>${new _U_.error.HttpError(500).message}</h1>`);
    });
};
