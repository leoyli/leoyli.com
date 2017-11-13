const passport              = require('passport');

// ancillaries
const { MongoError }        = require('mongodb');
const _fn                   = require('./methods');

// collector
const _pre = {};
const _end = { next: {}, error: {} };



// ==============================
//  APP GLOBAL
// ==============================
const preloadLocals = async (req, res, next) => {
    // flash message
    res.locals._flash = { error: req.flash('error'), info: req.flash('info'), pass: req.flash('pass') };

    // site settings
    const _config = await require('./../schema')._siteConfig.findOne();
    if (!_config) throw new Error('Database might be corrupted, please restart the server for DB initialization.');
    res.locals._site = _config._doc;

    // session loading
    if (!req.session.user && req.session.cookie.expires) req.session.cookie.expires = false;
    res.locals._session = (req.session.user) ? { user: req.session.user } : {};

    // view settings
    res.locals._view = {
        isConsole: (req.url.includes('/console')),
        titleTag: res.locals._site.title,
    };

    next();
};



// ==============================
//  _pre
// ==============================
// setting http header for prevent searching engine crawler
_pre.doNotCrawled = (req, res, next) => {
    res.set('x-robots-tag', 'none');
    next();
};


// passport loading
_pre.usePassport = [passport.initialize(), passport.session()];


// authentication checking
_pre.isSignedIn = [_pre.doNotCrawled, ..._pre.usePassport, (req, res, next) => {
    // if pass in authentications: move to next()
    if (req.isAuthenticated()) return next();

    // if fail in authentications: record the original address for latter redirection
    req.session.returnTo = req.originalUrl;

    // gives a flash message based on if just signed out
    if (res.locals._flash.pass) {
        req.flash('error', String(res.locals._flash.error));
        req.flash('info', String(res.locals._flash.info));
    } else req.flash('error', 'Please sign in first!');

    res.redirect('/signin');
}];


// authorization checking
_pre.isAuthorized = [..._pre.isSignedIn, (req, res, next) => {
    if (!req.user.docLists || req.user.docLists.posts.indexOf(_fn.string.readObjectID(req.url)) === -1) {    // option: find by post ID as a alternative
        req.flash('error', 'Nothing were found...');
        return res.redirect('/');
    } else next();
}];


// password validating rules
_pre.passwordValidation = (req, res, next) => {
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


// section title handler
_pre.prependTitleTag = (title) => (req, res, next) => {
    if (!next) next = () => {};
    res.locals._view.titleTag = `${title} - ${res.locals._view.titleTag}`;
    next();
};

_pre.appendTitleTag = (title) => (req, res, next) => {
    if (!next) next = () => {};
    res.locals._view.titleTag = `${res.locals._view.titleTag} - ${title}`;
    next();
};


// busboy in multipart form for media uploading
_pre.hireBusboy = (limits) => (req, res, next) => require('./busboy')(req, res, limits, next);



// ==============================
//  _end
// ==============================
// express async wrapper
_end.wrapAsync = (fn) => (req, res, next) => fn(req, res, next).catch(next);


// post render handler
_end.next.postRender = (view, doc) => (req, res) => {
    [view, doc] = !(view && doc) ? [res.locals._render.view, res.locals._render.post]: [view, doc];
    if (!doc) {
        req.flash('error', 'Nothing were found...');
        return res.redirect('back');
    } else if (doc.title) _pre.prependTitleTag(doc.title)(req, res);
    res.render(view, { post: doc });
};


// general error handler
_end.error.clientError = (err, req, res, next) => { // todo: shows client errors only or crash the server
    if (err.name === 'MongoError' && err.code === 11000) {
        req.flash('error', 'This username is not available.');
        return res.redirect('back');
    }
    if (err.name === 'UserExistsError') {
        req.flash('error', 'This email have been registered.');
        return res.redirect('back');
    }
    req.flash('error', err.toString());
    res.redirect('/');
};

module.exports = { _pre, _end, preloadLocals };
