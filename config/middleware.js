var exports = module.exports = {};

// signed in checking
exports.isSignedIn = function(req, res, next) {
    // if pass in authentications: move to next()
    if(req.isAuthenticated()) return next();

    // if fail in authentications: record the original address for latter redirection
    req.session.returnTo = req.originalUrl;
    req.flash('error', 'Please sign in first!');
    res.redirect('/signin');
};


// username acquisition
exports.localVariables = function(req, res, next) {
    // username as a global variable
    res.locals.currentUser = req.user ? req.user : {username: 'guest', _isGuest: true};

    // flash messages in classes
    res.locals.flashMessageError    = req.flash('error');
    res.locals.flashMessageInfo     = req.flash('info');
    return next();
};
