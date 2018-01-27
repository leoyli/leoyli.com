// ==============================
//  FUNCTIONS
// ==============================
const { _fn } = require('./methods');



// ==============================
//  MODULES (generic)
// ==============================
const generic = async (req, res, next) => {
    // website settings
    const _config = await require('../../models').settingModel.findOne();
    if (!_config) throw new Error('Database might be corrupted, please restart the server for DB initialization.');
    res.locals._site = _config._doc;

    // connecting session
    if (!req.session.user && req.session.cookie.expires) req.session.cookie.expires = false;

    // template variables
    res.locals._view = {
        isOnPanel: req.url.includes('/home'),
        flash: { error: req.flash('error'), info: req.flash('info'), pass: req.flash('pass') },
        title: res.locals._site.title,
        user: req.session.user,
    };

    // HTMLEscape  // tofix: apply the method into post schema
    if (req.body.post) {
        if (req.body.post.content) req.body.post.content = _fn.string.escapeInHTML(req.body.post.content);
        if (req.body.post.title) req.body.post.title = _fn.string.escapeInHTML(req.body.post.title);
        if (req.body.post.category) req.body.post.category = _fn.string.escapeInHTML(req.body.post.category);
        if (req.body.post.tag) req.body.post.tag = _fn.string.escapeInHTML(req.body.post.tag);
    }

    return next();
};



// module export
module.exports = generic;
