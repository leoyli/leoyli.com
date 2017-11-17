// ancillaries
const _fn                   = require('./methods');



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

    next();
};



// ==============================
//  _pre
// ==============================
const _pre = {};

// http header for stopping crawlers
_pre.doNotCrawled = (req, res, next) => {
    res.set('x-robots-tag', 'none');
    next();
};


// passport
const passport = require('passport');
_pre.usePassport = [passport.initialize(), passport.session()];


// authentication
_pre.isSignedIn = [_pre.doNotCrawled, ..._pre.usePassport, (req, res, next) => {
    if (req.isAuthenticated()) return next();
    if (res.locals._view.flash.pass[0]) {
        req.flash('error', String(res.locals._view.flash.error));
        req.flash('info', String(res.locals._view.flash.info));
    } else req.flash('error', 'Please sign in first!');
    req.session.returnTo = req.originalUrl;
    res.redirect('/signin');
}];


// authorization
_pre.isAuthorized = [..._pre.isSignedIn, async (req, res, next) => {
    const [field, val] = (req.params.KEY) ? ['canonicalKey', req.params.KEY] : ['_id', _fn.string.readObjectID(req.url)];
    const count = await require('../models').postModel.count({ [field]: val, 'provider._id': req.user });

    if (count !== 1) {
        req.flash('error', 'You do not have a valid authorization...');
        return res.redirect('/');
    } else next();
}];


// password validations
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
    res.locals._view.title = `${title} - ${res.locals._view.title}`;
    next();
};

_pre.appendTitleTag = (title) => (req, res, next) => {
    if (!next) next = () => {};
    res.locals._view.title = `${res.locals._view.title} - ${title}`;
    next();
};


// busboy for multipart form parsing
_pre.hireBusboy = (limits) => (req, res, next) => require('./busboy')(req, res, limits, next);



// ==============================
//  _end
// ==============================
const _end = { next: {}, error: {} };

// async wrapper for error catching
_end.wrapAsync = (fn) => (req, res, next) => fn(req, res, next).catch(next);


// post render handler
_end.next.postRender = (view, doc) => async (req, res) => {
    [view, doc] = !(view && doc) ? [req.session.view.template, req.session.view.post]: [await view, await doc];
    delete req.session.view;

    if (doc) {
        if (doc.title) _pre.prependTitleTag(doc.title)(req, res);
        return res.render(view, { post: doc });
    } else {
        req.flash('error', 'Nothing were found...');
        return res.redirect('back');
    }
};


// general error handler
_end.error.clientError = (err, req, res, next) => {     // todo: error handler separations
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



module.exports = { _pre, _end, _global };
