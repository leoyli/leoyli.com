module.exports = editor = {};



// ==============================
//  FUNCTIONS
// ==============================
const { _fn } = require('../modules/methods');
const { postModel } = require('../../models');



// ==============================
//  CONTROLLERS
// ==============================
editor.post = {
    get: [],
    post: async (req, res) => {
        await postModel.postsCreateThenAssociate(req.body.post, req.user);
        req.flash('info', 'post have been successfully posted!');
        res.redirect('/post');
    },
};

editor.edit = {
    get: async (req, res, next) => {
        if (!res.session.view) res.session.view = { post: await postModel.findById(_fn.string.readObjectID(req.url))};
        next();
    },
    patch: async (req, res) => {
        const doc = await postModel.findByIdAndUpdate(_fn.string.readObjectID(req.url), req.body.post, { new: true });
        req.flash('info', 'post have been successfully updated!');
        res.redirect(`/post/${doc.canonical}`);
    },
    delete: async (req, res) => { // todo: trash can || double check
        await postModel.postsDeleteThenDissociate(_fn.string.readObjectID(req.url), req.user);
        req.flash('info', 'post have been successfully deleted!');
        res.redirect(`/post/`);
    },
};
