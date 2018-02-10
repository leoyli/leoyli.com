// ==============================
//  FUNCTIONS
// ==============================
const { _fn } = require('../helpers');



// ==============================
//  MODULES (generic)
// ==============================
const generic = async (req, res, next) => {
    // website settings
    const _config = await require('../../models').settingModel.findOne();
    if (!_config) throw new Error('No website configs, please restart the server for DB initialization.');
    res.locals._site = _config._doc;

    // connecting session
    if (!req.session.user && req.session.cookie.expires) req.session.cookie.expires = false;

    // template variables
    res.locals._view = {
        _status: { isPanel: req.url.includes('/home') },
        flash: { error: req.flash('error'), info: req.flash('info'), pass: req.flash('pass') },
        title: res.locals._site.title,
        user: req.session.user,
    };

    // HTMLEscape  // tofix: apply the method into post schema
    if (req.body.post) for (const field in req.body.post) {
        if (field === 'title') continue;    // tofix: temperately leave the title field unescaped
        if (req.body.post.hasOwnProperty(field)) req.body.post[field] = _fn.string.escapeChars(req.body.post[field]);
    }

    return next();
};



// module export
module.exports = generic;
