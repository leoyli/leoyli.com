const { AccountError } = require('../modules/')._$.error;
const { _$ } = require('../modules/');
const passport = require('passport');
module.exports = exports = { _md: {} };



// ==============================
//  MIDDLEWARE PLUGINS
// ==============================
// http header for stopping crawlers
exports._md.doNotCrawled = (req, res, next) => {
    res.set('x-robots-tag', 'none');
    return next();
};


// case insensitive to access `req.query`
exports._md.caseInsensitiveQuery = (req, res, next) => {
    req.query = new Proxy(req.query, {
        get: (target, entry) => target[Object.keys(target).find(key => key.toLowerCase() === entry.toLowerCase())],
    });
    return next();
};


// busboy for multipart form parsing
exports._md.hireBusboy = (limits) => (req, res, next) => require('./upload').uploadController(req, res, limits, next);


// set title tag
exports._md.setTitleTag = (title, { append, root } = {}) => (req, res, next) => {
    const sequence = [];
    if (root !== false) sequence.push(res.locals._view.title);
    if (append === true) sequence.push(title);
    else sequence.unshift(title);
    res.locals._view.title = sequence.join(' - ');
    if (typeof next === 'function') return next();
};


// passport
exports._md.usePassport = [passport.initialize(), passport.session()];


// authentication   // tofix: change to error handling scheme
exports._md.isSignedIn = [exports._md.doNotCrawled, ...exports._md.usePassport, (req, res, next) => {
    if (req.isAuthenticated()) return next();
    if (res.locals._view.flash.pass[0] === undefined) {
        req.flash('error', String(res.locals._view.flash.error));
        req.flash('info', String(res.locals._view.flash.info));
    } else req.flash('error', 'Please sign in first!');
    req.session.returnTo = req.originalUrl;
    return res.redirect('/signin');
}];


// authorization
exports._md.isAuthorized = [...exports._md.isSignedIn, async (req, res, next) => {
    const [field, val] = req.params.canonical !== undefined
        ? ['canonical', req.params.canonical]
        : ['_id', _$.string.readMongoId(req.url)];
    if (await require('../../models/').postModel.count({ [field]: val, 'author._id': req.user }) !== 1) {
        throw new AccountError('You do not have a valid authorization...');
    } else return next();
}];


// password validations
exports._md.passwordValidation = (req, res, next) => {
    if (!req.body.password.new || !req.body.password.confirmed) {
        throw new AccountError('Please fill all required fields.');
    } else if (req.body.password.new.toString() !== req.body.password.confirmed.toString()) {
        throw new AccountError('Two new password does not the same.');
    } else if (req.body.password.old && (req.body.password.old.toString() === req.body.password.new.toString())) {
        throw new AccountError('Password cannot be the same as the old one.');
    } else return next();
};
