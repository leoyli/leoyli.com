exports = module.exports = {};



// local variables loading
exports.localVariables = (req, res, next) => {
    // always query site config with DB before move to the next()
    const _siteConfig = require('./../models/_siteConfig');
    _siteConfig.findOne({}, (err, loadedConfig) => {
        // site config
        res.locals._site = loadedConfig;

        // current username
        res.locals.currentUser = req.user ? req.user : {username: 'guest', _isGuest: true};

        // flash messages sorted as classes
        res.locals.flashMessageError = req.flash('error');
        res.locals.flashMessageInfo = req.flash('info');

        next();
    });
};


// authentication checking
exports.isSignedIn = (req, res, next) => {
    // if pass in authentications: move to next()
    if (req.isAuthenticated()) return next();

    // if fail in authentications: record the original address for latter redirection
    req.session.returnTo = req.originalUrl;

    // gives a flash message based on if just signed out
    if (req.session.justSignedOut) req.flash('info', String(res.locals.flashMessageInfo));
    else req.flash('error', 'Please sign in first!');

    res.redirect('/signin');
};


// authorization checking
function _isAuthorized (req, res, next) {
    if (req.user.ownedPosts.indexOf(req.params.POSTID || req.loadedPost._id) === -1) {    // option: find by post ID as a alternative
        req.flash('error', 'Sorry... You have not been authorized!');
        return res.redirect('back');
    } else next();
}
exports.isAuthorized = [exports.isSignedIn, _isAuthorized];


// scripts sanitizer
exports.putSanitizer = (req, res, next) => {
    if (req.body.post.content) req.body.post.content = req.sanitize(req.body.post.content);
    next();
};
