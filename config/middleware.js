exports = module.exports = {};



// local variables pre-loading (global middleware)
exports.preloadLocals = (req, res, next) => {
    // flash message
    res.locals._flash = {error: req.flash('error'), info: req.flash('info')};

    // site settings
    require('./../models/_siteConfig').findOne()
        .then(_siteConfig => {
            if (!_siteConfig) throw new Error('Database corrupted, please restart the server for DB initialization.');
            res.locals._site = _siteConfig._doc;
            res.locals._site.titleTag = res.locals._site.title;
            res.locals._site.client = req.user ? req.user._doc : {nickname: 'guest', isGuest: true};
            next();
        })
        .catch(err => next(err, null));
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
        return res.status(401).render('./theme/error', {message: '401 UNAUTHORIZED', error: new Error('UNAUTHORIZED')});
    } else next();
}
exports.isAuthorized = [exports.isSignedIn, _isAuthorized];


// scripts sanitizer
exports.putPostSanitizer = (req, res, next) => {
    if (req.body.post.content) req.body.post.content = req.sanitize(req.body.post.content);
    next();
};


// password validating rules
exports.passwordValidation = (req, res, next) => {
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
exports.setPageTitle = (title) => {
    return (req, res, next) => {
        if (!next) next = () => {};
        res.locals._site.titleTag = `${res.locals._site.titleTag} - ${title}`;
        next();
    }
};
