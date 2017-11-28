const _fn = require('../methods');
const { _md } = require('../middleware');
const { postModel } = require('../../models');
const editor = {
    post: {
        get: require('../render').post('./console/editor', {}),
        post: _md.wrapAsync(async (req, res) => {
            await postModel.postsCreateThenAssociate(req.body.post, req.user);
            req.flash('info', 'post have been successfully posted!');
            res.redirect('/post');
        }),
    },
    edit: {
        get: (req, res) => {
            require('../render').post('./console/editor', postModel.findById(_fn.string.readObjectID(req.url)))(req, res);
        },
        patch: _md.wrapAsync(async (req, res) => {
            const doc = await postModel.findByIdAndUpdate(_fn.string.readObjectID(req.url), req.body.post, { new: true });
            req.flash('info', 'post have been successfully updated!');
            res.redirect(`/post/${doc.canonical}`);
        }),
        delete: _md.wrapAsync(async (req, res) => { // todo: trash can || double check
            await postModel.postsDeleteThenDissociate(_fn.string.readObjectID(req.url), req.user);
            req.flash('info', 'post have been successfully deleted!');
            res.redirect(`/post/`);
        }),
    }
};



// controller export
module.exports = editor;
