// ==============================
//  FUNCTIONS
// ==============================
const { _fn } = require('../helpers');



// ==============================
//  MODULES (generic)
// ==============================
const generic = async (req, res, next) => {
    // website settings
    const config = await require('../../models').settingModel.findOne({ active: true });
    if (!config) throw new Error('No website configs, please restart the server for DB initialization.');
    res.locals._site = config._doc;

    // connecting session
    if (!req.session.user && req.session.cookie.expires) req.session.cookie.expires = false;

    // template variables
    res.locals._view = {
        _status: { isPanel: req.url.includes('/home') },
        flash: { error: req.flash('error'), info: req.flash('info'), pass: req.flash('pass') },
        title: res.locals._site.title,
        user: req.session.user,
    };

    return req.body.post && ['POST', 'PATCH'].indexOf(req.method) !== -1 ? postNormalizer(req, res, next) : next();
};


const postNormalizer = async (req, res, next) => {
    const post = req.body.post;
    if (!post) return next();

    if (req.method === 'POST' && !post.canonical) post.canonical = _fn.string.toKebabCase(post.title);
    if (post.canonical !== undefined) {
        const canonicalCounts = await require('../../models').postModel.count({ canonical: post.canonical });
        if (canonicalCounts > 0) post.canonical = post.canonical + '-' + (canonicalCounts + 1);
    }
    post.featured   = _fn.string.inspectFileURL(post.featured, res.locals._site.sets.imageTypes, { raw: false });
    post.title      = _fn.string.escapeChars(post.title);
    post.content    = _fn.string.escapeChars(post.content);                             // tofix: using sanitizer
    post.category   = _fn.string.toKebabCase(post.category) || undefined;
    post.tag        = _fn.string.toKebabCase(post.tag) || undefined;
    post.visibility = _fn.object.assignDeep({}, post.visibility || 'normal', true);     // todo: split the assignment
    return next();
};


// module export
module.exports = generic;
