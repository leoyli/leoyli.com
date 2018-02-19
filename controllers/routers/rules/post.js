module.exports = exports = { editor: {}, post: {} };



// ==============================
//  FUNCTIONS
// ==============================
const { _fn } = require('../../helpers');
const { postModel } = require('../../../models/index');
const search = require('../../middleware/search');



// ==============================
//  CONTROLLERS
// ==============================
exports.editor.post = {
    get: [],
    post: async (req, res) => {
        await postModel.postsCreateThenAssociate(req.body.post, req.user);
        req.flash('info', 'post have been successfully posted!');
        return res.redirect('/post');
    },
};

exports.editor.edit = {
    alias: async (req, res) => {
        req.session.view = { post: await postModel.findOne(req.params) };
        return res.redirect(`/post/editor/${req.session.view.post._id}`);
    },
    get: async (req, res, next) => {
        if (!req.session.view) req.session.view = { post: await postModel.findById(_fn.string.readMongoId(req.url)) };
        return next();
    },
    patch: async (req, res) => {
        const doc = await postModel.findByIdAndUpdate(_fn.string.readMongoId(req.url), req.body.post, { new: true });
        req.flash('info', 'post have been successfully updated!');
        return res.redirect(`/post/${doc.canonical}`);
    },
    delete: async (req, res) => { // todo: trash can || double check
        await postModel.postsDeleteThenDissociate(_fn.string.readMongoId(req.url), req.user);
        req.flash('info', 'post have been successfully deleted!');
        return res.redirect('/post/');
    },
};

exports.post.show = {
    alias: async (req, res) => {
        if (req.session.user)req.session.view = { post : await postModel.findOne(req.params) };
        else req.session.view = { post : await postModel.findOne({ ...req.params, status: 'published' })};
        return res.redirect(`/post/${req.session.view.post.canonical}`);
    },
    get: async (req, res, next) => {    // tofix: post not found page
        if (!req.session.view) {
            const query = { canonical: req.params[0] };
            if (req.session.user) req.session.view = { post : await postModel.findOne(query)};
            else req.session.view = { post : await postModel.findOne({ ...query, status: 'published' })};
        } return next();
    },
};

exports.post.list = {
    get: async (req, res, next) => {
        return search.find()(req, res, next);
    },
};
