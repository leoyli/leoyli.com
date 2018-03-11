const { ClientError } = require('../utilities/')._U_.error;
const { _U_ } = require('../utilities/');
const passport = require('passport');
module.exports = exports = { _M_: {} };



// ==============================
//  MIDDLEWARE PLUGINS
// ==============================
// http header for stopping crawlers
exports._M_.doNotCrawled = (req, res, next) => {
    res.set('x-robots-tag', 'none');
    return next();
};


// case insensitive to access `req.query`
exports._M_.caseInsensitiveQuery = (req, res, next) => {
    req.query = new Proxy(req.query, {
        get: (target, entry) => target[Object.keys(target).find(key => key.toLowerCase() === entry.toLowerCase())],
    });
    return next();
};


// busboy for multipart form parsing
exports._M_.hireBusboy = (limits) => (req, res, next) => require('./upload').uploadController(req, res, limits, next);


// set title tag
exports._M_.setTitleTag = (title, { append, root } = {}) => (req, res, next) => {
    const sequence = [];
    if (root !== false) sequence.push(res.locals._view.title);
    if (append === true) sequence.push(title);
    else sequence.unshift(title);
    res.locals._view.title = sequence.join(' - ');
    if (typeof next === 'function') return next();
};


// passport
exports._M_.usePassport = [passport.initialize(), passport.session()];


// authentication
exports._M_.isSignedIn = [exports._M_.doNotCrawled, ...exports._M_.usePassport, (req, res, next) => {
    if (req.isAuthenticated() && req.session.user) return next();
    else throw new ClientError(20003);
}];


// authorization
exports._M_.isAuthorized = [...exports._M_.isSignedIn, async (req, res, next) => {
    const [field, val] = req.params.canonical !== undefined
        ? ['canonical', req.params.canonical]
        : ['_id', _U_.string.readMongoId(req.url)];
    if (await require('../../models/').postModel.count({ [field]: val, 'author._id': req.user }) !== 1) {               // tofix: find the post first then decide to give or not
        throw new ClientError(20001);
    } else return next();
}];


// password validations
exports._M_.passwordValidation = (req, res, next) => {
    if (!req.body.password.new || !req.body.password.confirmed) {
        throw new ClientError(10001);
    } else if (req.body.password.new.toString() !== req.body.password.confirmed.toString()) {
        throw new ClientError(10002);
    } else if (req.body.password.old && (req.body.password.old.toString() === req.body.password.new.toString())) {
        throw new ClientError(10003);
    } else return next();
};
