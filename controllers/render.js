const { _md } = require('./modules/core');
module.exports = exports = {};



// render post
exports.post = (view, doc) => async (req, res) => {
    const template = view ? await view : req.session.view.template;
    const post = doc ? await doc : (req.session.view ? req.session.view.post || {} : {});
    delete req.session.view;

    if (post.length === 0) {
        req.flash('error', 'Nothing were found...');
        return res.redirect('back');
    } else {
        if (post.title) _md.setTitleTag(post.title, { root: true })(req, res);
        return res.render(template || './theme/post/post', { post: post });
    }
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
    return res.redirect('/');
};
