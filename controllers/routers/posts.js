module.exports = exports = { editor: {}, posts: {} };



// ==============================
//  DEPENDENCIES
// ==============================
const { _U_ } = require('../utilities/');
const { postModel } = require('../../models/');
const { fetch } = require('../middleware/fetch');



// ==============================
//  CONTROLLERS
// ==============================
exports.editor.post = {
    get: (req, res, next) => {
        req.session._view = { post: {} };
        return next();
    },
    post: async (req, res) => {
        await postModel.postsCreateThenAssociate(req.body.post, req.user);          // tofix: ValidationError handle
        req.flash('info', 'post have been successfully posted!');
        return res.redirect('/posts');
    },
};

exports.editor.edit = {
    alias: async (req, res) => {
        req.session._view = { post: await postModel.findOne(req.params) };
        return res.redirect(`/posts/edit/${req.session._view.post._id}`);
    },
    get: async (req, res, next) => {
        if (!req.session._view) req.session._view = { post: await postModel.findById(_U_.string.readMongoId(req.url)) };
        return next();
    },
    patch: async (req, res) => {
        const doc = await postModel.findByIdAndUpdate(_U_.string.readMongoId(req.url), req.body.post, { new: true });
        req.flash('info', 'post have been successfully updated!');
        return res.redirect(`/posts/${doc.canonical}`);
    },
    delete: async (req, res) => { // todo: trash can || double check
        await postModel.postsDeleteThenDissociate(_U_.string.readMongoId(req.url), req.user);
        req.flash('info', 'post have been successfully deleted!');
        return res.redirect('/posts/');
    },
};

exports.posts.show = {
    alias: async (req, res) => {
        if (req.session.user) req.session._view = { post : await postModel.findOne(req.params) };
        else req.session._view = { post : await postModel.findOne({ ...req.params, status: 'published' })};
        return res.redirect(`/posts/${req.session._view.post.canonical}`);
    },
    get: async (req, res, next) => {    // tofix: post not found page
        if (!req.session._view) {
            const query = { canonical: req.params[0] };
            if (req.session.user) req.session._view = { post : await postModel.findOne(query)};
            else req.session._view = { post : await postModel.findOne({ ...query, status: 'published' })};
        } return next();
    },
};

exports.posts.list = {
    get: (req, res, next) => {
        return fetch({ num: res.locals._site.sets.num })(req, res, next);
    },
};
