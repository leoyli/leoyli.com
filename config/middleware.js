var exports = module.exports = {};

// username acquisition
exports.localVariables = function(req, res, next) {
    // username as a global variable
    res.locals.currentUser = req.user ? req.user : {username: 'guest', _isGuest: true};

    // flash messages in classes
    res.locals.flashMessageError    = req.flash('error');
    res.locals.flashMessageInfo     = req.flash('info');
    return next();
};


// authentication checking
exports.isSignedIn = function(req, res, next) {
    // if pass in authentications: move to next()
    if (req.isAuthenticated()) return next();

    // if fail in authentications: record the original address for latter redirection
    req.session.returnTo = req.originalUrl;
    req.flash('error', 'Please sign in first!');
    res.redirect('/signin');
};


// authorization checking
exports.isAuthorized = function (req, res, next) {
    if (req.user.ownedPosts.indexOf(req.params.POSTID) < 0) {
        req.flash('error', 'Sorry... You have not been authorized!');
        return res.redirect('back');
    }
    next();
};


// scripts sanitizer
exports.putSanitizer = function (req, res, next) {
    if (req.body.post.content) req.body.post.content = req.sanitize(req.body.post.content);
    return next();
};
