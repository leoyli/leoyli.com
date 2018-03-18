const { _U_ } = require('../utilities/');
const { configsModel, postsModel } = require('../../models/');



const generic = async (req, res, next) => {
    // checking website settings in environment variables
    if (!process.env['$WEBSITE_CONFIGS']) configsModel.initialize(() => {
        if(!process.env['$WEBSITE_CONFIGS']) throw new _U_.error.ServerError(90001);
    });

    // populating routing variables
    res.locals.$$SITE = JSON.parse(process.env['$WEBSITE_CONFIGS']);
    res.locals.$$VIEW = {
        flash   : { error: req.flash('error'), info: req.flash('info'), action: req.flash('action') },
        title   : res.locals.$$SITE.title,
        route   : req.baseUrl + req.path,
        user    : req.session.user,
    };

    // configuring session variables
    if (!req.session.user && req.session.cookie.expires) req.session.cookie.expires = false;
    if (res.locals.$$VIEW.flash.action[0] !== 'retry') delete req.session.returnTo;

    return req.body.post && ['POST', 'PATCH'].indexOf(req.method) !== -1 ? postNormalizer(req, res, next) : next();
};


const postNormalizer = async (req, res, next) => {
    const post = req.body.post;
    if (!post) return next();

    if (req.method === 'POST' && !post.canonical) post.canonical = _U_.string.toKebabCase(post.title);
    if (post.canonical !== undefined) {
        const counts = await postsModel.count({ canonical: { $regex: new RegExp(`^${post.canonical}(?:-[0-9]+)?$`) }});
        if (counts > 0) post.canonical = post.canonical + '-' + (counts + 1);
    }
    post.featured   = _U_.string.inspectFileURL(post.featured, res.locals.$$SITE.sets.imageTypes, { raw: false });
    post.title      = _U_.string.escapeChars(post.title);
    post.content    = _U_.string.escapeChars(post.content);                             // tofix: using sanitizer
    post.category   = _U_.string.toKebabCase(post.category) || undefined;
    post.tags       = _U_.string.toKebabCase(post.tags) || undefined;
    post.visibility = _U_.object.assignDeep({}, post.visibility || 'normal', true);     // todo: split the assignment
    return next();
};



// exports
module.exports = generic;
