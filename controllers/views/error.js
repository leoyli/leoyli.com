const { _U_ } = require('../utilities/');
const { _M_ } = require('../middleware/plugins');



// gateway
function errorHandler (err, req, res, next) {     // todo: error handler separations
    if (['dev', 'test'].indexOf(process.env['NODE_ENV']) !== -1) console.log(err.stack);
    if (_U_.error.hasOwnProperty(err.name) && terminal[err.name]) {
        return terminal[err.name](err, req, res, next);
    } else return res.render('./theme/error', { err });
}


// terminal
const terminal = {};

terminal.ClientError = (err, req, res, next) => {
    switch (err.from) {
        case 'UserExistsError':
            req.flash('error', 'This email have been used.');
            break;
        case 'ValidationError':
            req.flash('error', err.message);
            break;
        case 'BulkWriteError':
            return terminal.MongoError(err, req, res, next);
        default:
            req.flash('error', err.message);
    }

    if (!err.from && err.code === 20003) return redirect.signInRetry(req, res);
    else return res.redirect('back');
};

terminal.MongoError = (err, req, res, next) => {
    if (err.code === 11000) req.flash('error', 'This username is not available.');
    return res.redirect('back');
};

terminal.HttpError = (err, req, res, next) => {
    return _M_.doNotCrawled(req, res, () => {
        return res.status(err.status).render('./theme/error', {err});
    });
};

terminal.TemplateError = (err, req, res, next) => {
    return _M_.doNotCrawled(req, res, () => {
        // todo: log the message and call the admin
        // todo: guidance for the client
        return res.status(500).send(`<h1>${new _U_.error.HttpError(500).message}</h1>`);
    });
};


// redirect
const redirect = {};

redirect.signInRetry = (req, res) => {
    // if logout from a authentication required page
    if (req.get('Referrer') && RegExp('^https?:\\/\\/[^\\/]+(.+$)').exec(req.get('Referrer'))[1] === req.originalUrl) { // option: generalized this string reading method
        req.flash('info', res.locals._view.flash.info.toString());
        delete req.flash('error');
    }

    // label the returning page which only be returned if action is 'retry'
    req.session.returnTo = req.originalUrl;
    req.flash('action', 'retry');
    return res.redirect('/signin');
};


// exports
module.exports = exports = errorHandler;
