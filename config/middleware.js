exports = module.exports = {};



// local variables loading
exports.localVariables = (req, res, next) => {
    // always query site config with DB before move to the next()
    const _siteConfig = require('./../models/_siteConfig');
    _siteConfig.findOne({}, (err, loadedConfig) => {
        // site config
        res.locals._site = loadedConfig._doc;
        res.locals._site.currentUser = req.user ? req.user._doc : {nickname: 'guest', _isGuest: true};

        // flash messages sorted as classes
        res.locals._flash = {error: req.flash('error'), info: req.flash('info')};

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
    if (req.session.justSignedOut) req.flash('info', String(res.locals._flash.info));
    else req.flash('error', 'Please sign in first!');

    res.redirect('/signin');
};


// authorization checking
function _isAuthorized (req, res, next) {
    if (req.user.docLists.posts.indexOf(req.params.POSTID || req.loadedPost._id) === -1) {    // option: find by post ID as a alternative
        req.flash('error', 'Sorry... You have not been authorized!');
        return res.status(404).render('/404');
    } else next();
}
exports.isAuthorized = [exports.isSignedIn, _isAuthorized];


// scripts sanitizer
exports.putPostSanitizer = (req, res, next) => {
    if (req.body.post.content) req.body.post.content = req.sanitize(req.body.post.content);
    next();
};
