var exports = module.exports = {};

exports.isLoggedIn = function(req, res, next) {
    if(req.isAuthenticated()) return next();

    // record the original address for latter redirection
    req.session.returnTo = req.originalUrl;
    res.redirect('/signin');
};
