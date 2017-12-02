const
    methodOverride          = require('method-override'),
    bodyParser              = require('body-parser'),
    flash                   = require('connect-flash'),
    logger                  = require('morgan'),
    favicon                 = require('serve-favicon');



function _useMiddleware(app) {
    // external
    //app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
    if (process.env.NODE_ENV === 'dev') app.use(logger('dev'));
    app.use(methodOverride('_method'));
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(flash());

    // internal
    app.use(require('../controllers/modules/generic'));
}


function _useRoutes(app) {
    // seed
    if (process.env.NODE_ENV === 'dev' || 'test') app.use('/seed', require('../routes/seed'));

    // units
    app.use('/dashboard', require('../routes/dashboard'));
    app.use('/post', require('../routes/post'));
    app.use('/', require('../routes/authentication'));
    app.use('/', require('../routes/page'));

    // error
    app.use('/', require('../routes/error'));
}


function init(app) {
    _useMiddleware(app);
    _useRoutes(app);
}



module.exports = { init };
