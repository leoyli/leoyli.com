// ancillaries
const _fn                   = require('./methods');

// collector
const _pre = {};
const _end = {next: {}, error: {}};



// ==============================
//  APP GLOBAL
// ==============================
const preloadLocals = async (req, res, next) => {
    // flash message
    res.locals._flash = {error: req.flash('error'), info: req.flash('info')};

    // site settings
    const _config = await require('./../models/_siteConfig').findOne();
    if (!_config) throw new Error('Database might be corrupted, please restart the server for DB initialization.');
    res.locals._site = _config._doc;
    res.locals._site.titleTag = res.locals._site.title;
    res.locals._site.client = req.user ? req.user._doc : {nickname: 'guest', isGuest: true};

    next();
};



// ==============================
//  _pre
// ==============================
// authentication checking
_pre.isSignedIn = (req, res, next) => {
    // if pass in authentications: move to next()
    if (req.isAuthenticated()) return next();

    // if fail in authentications: record the original address for latter redirection
    req.session.returnTo = req.originalUrl;

    // gives a flash message based on if just signed out
    if (req.session.justSignedOut) {
        delete req.session.justSignedOut;
        req.flash('info', String(res.locals._flash.info));
    } else req.flash('error', 'Please sign in first!');

    res.redirect('/signin');
};


// authorization checking
_pre.isAuthorized = [_pre.isSignedIn, (req, res, next) => {
    if (req.user.docLists.posts.indexOf(_fn.string.readObjectID(req.url)) === -1) {    // option: find by post ID as a alternative
        req.flash('error', 'Nothing were found...');
        return res.redirect('/');
    } else next();
}];


// password validating rules
_pre.passwordValidation = (req, res, next) => {
    if (!req.body.password.old || !req.body.password.new || !req.body.password.confirmed) {
        req.flash('error', 'Please fill all fields.');
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
    res.locals._site.titleTag = `${title} - ${res.locals._site.titleTag}`;
    next();
};

_pre.appendTitleTag = (title) => (req, res, next) => {
    if (!next) next = () => {};
    res.locals._site.titleTag = `${res.locals._site.titleTag} - ${title}`;
    next();
};


// busboy in multipart form for media uploading
_pre.hireBusboy = (limits) => (req, res, next) => require('./busboy')(req, res, limits, next);


// express async wrapper
_pre.wrapAsync = (fn) => (req, res, next) => fn(req, res, next).catch(next);



// ==============================
//  _end
// ==============================
// post render handler
_end.next.postRender = (view, doc) => (req, res) => {
    [view, doc] = !(view && doc) ? [res.locals._render.view, res.locals._render.post]: [view, doc];
    if (!doc) {
        req.flash('error', 'Nothing were found...');
        return res.redirect('back');
    } else if (doc.title) _pre.prependTitleTag(doc.title)(req, res);
    res.render(view, {post: doc});
};


// general error handler
_end.error.clientError = (err, req, res, next) => { // todo: shows client errors only or crash the server
    req.flash('error', err.toString());
    res.redirect('/');
};

module.exports = {_pre, _end, preloadLocals};
