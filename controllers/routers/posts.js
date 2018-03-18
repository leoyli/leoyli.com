module.exports = exports = { editor: {}, posts: {} };



// ==============================
//  DEPENDENCIES
// ==============================
const { _U_ } = require('../utilities/');
const { postsModel } = require('../../models/');
const { fetch } = require('../middleware/fetch');



// ==============================
//  CONTROLLERS
// ==============================
exports.editor.post = {
    get: (req, res, next) => {
        req.session.chest = { post: {} };
        return next();
    },
    post: async (req, res) => {
        await postsModel.create({ author: req.session.user, ...req.body.post });
        req.flash('info', 'post have been successfully posted!');
        return res.redirect('/posts');
    },
};

exports.editor.edit = {
    alias: async (req, res) => {
        req.session.chest = { post: await postsModel.findOne(req.params) };
        return res.redirect(`/posts/edit/${req.session.chest.post._id}`);
    },
    get: async (req, res, next) => {
        if (!req.session.chest) req.session.chest = { post: await postsModel.findById(_U_.string.readMongoId(req.url)) };
        return next();
    },
    patch: async (req, res) => {
        const doc = await postsModel.findByIdAndUpdate(_U_.string.readMongoId(req.url), req.body.post, { new: true });
        req.flash('info', 'post have been successfully updated!');
        return res.redirect(`/posts/${doc.canonical}`);
    },
    delete: async (req, res) => { // todo: trash can || double check
        await postsModel.remove({ _id: _U_.string.readMongoId(req.url) });
        req.flash('info', 'post have been successfully deleted!');
        return res.redirect('/posts/');
    },
};

exports.posts.show = {
    alias: async (req, res) => {
        if (req.session.user) req.session.chest = { post : await postsModel.findOne(req.params) };
        else req.session.chest = { post : await postsModel.findOne({ ...req.params, status: 'published' })};
        return res.redirect(`/posts/${req.session.chest.post.canonical}`);
    },
    get: async (req, res, next) => {    // tofix: post not found page
        if (!req.session.chest) {
            const query = { canonical: req.params[0] };
            if (req.session.user) req.session.chest = { post : await postsModel.findOne(query)};
            else req.session.chest = { post : await postsModel.findOne({ ...query, status: 'published' })};
        } return next();
    },
};

exports.posts.list = {
    get: fetch('postsModel'),
};
