// ancillaries
const _fn = require('./methods');



// ==============================
//  GLOBAL MIDDLEWARE
// ==============================
const _global = async (req, res, next) => {
    // website settings
    const _config = await require('../models').settingModel.findOne();
    if (!_config) throw new Error('Database might be corrupted, please restart the server for DB initialization.');
    res.locals._site = _config._doc;

    // connecting session
    if (!req.session.user && req.session.cookie.expires) req.session.cookie.expires = false;

    // template variables
    res.locals._view = {
        isConsole: (req.url.includes('/console')),
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

    next();
};



// ==============================
//  _md
// ==============================
const _md = {};


// http header for stopping crawlers
_md.doNotCrawled = (req, res, next) => {
    res.set('x-robots-tag', 'none');
    next();
};


// passport
const passport = require('passport');
_md.usePassport = [passport.initialize(), passport.session()];


// authentication
_md.isSignedIn = [_md.doNotCrawled, ..._md.usePassport, (req, res, next) => {
    if (req.isAuthenticated()) return next();
    if (res.locals._view.flash.pass[0]) {
        req.flash('error', String(res.locals._view.flash.error));
        req.flash('info', String(res.locals._view.flash.info));
    } else req.flash('error', 'Please sign in first!');
    req.session.returnTo = req.originalUrl;
    res.redirect('/signin');
}];


// authorization
_md.isAuthorized = [..._md.isSignedIn, async (req, res, next) => {
    const [field, val] = req.params.canonical
        ? ['canonical', req.params.canonical]
        : ['_id', _fn.string.readObjectID(req.url)];
    const count = await require('../models').postModel.count({ [field]: val, 'author._id': req.user });
    if (count !== 1) {
        req.flash('error', 'You do not have a valid authorization...');
        return res.redirect('/');
    } else next();
}];


// password validations
_md.passwordValidation = (req, res, next) => {
    if (!req.body.password.new || !req.body.password.confirmed) {
        req.flash('error', 'Please fill all required fields.');
    } else if (req.body.password.new !== req.body.password.confirmed) {
        req.flash('error', 'Two new password does not the same.');
    } else if (req.body.password.old === req.body.password.new) {
        req.flash('error', 'Password cannot be the same as the old one.');
    } else {
        return next();
    }
    res.redirect('back');
};


// set title tag
_md.setTitleTag = (title, { append, root, sequence = [] } = {}) => (req, res, next) => {
    if (root === true) sequence.push(res.locals._view.title);
    if (append === true) sequence.push(title);
    else sequence.unshift(title);
    res.locals._view.title = sequence.join(' - ');
    if (typeof next === 'function') return next();
};


// busboy for multipart form parsing
_md.hireBusboy = (limits) => (req, res, next) => require('./busboy')(req, res, limits, next);


module.exports = { _md, _global };
