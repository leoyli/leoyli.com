// ==============================
//  APP INITIALIZATION
// ==============================
const
    express                 = require('express'),
    session                 = require('express-session'),
    mongoose                = require("mongoose"),
    MongoStore              = require('connect-mongo')(session),
    flash                   = require('connect-flash'),
    path                    = require('path'),
    logger                  = require('morgan'),
    bodyParser              = require('body-parser'),
    methodOverride          = require('method-override'),
    favicon                 = require('serve-favicon'),
    passport                = require('passport'),
    app = express();



// ==============================
//  DB
// ==============================
// connection
mongoose.connect(process.env.DB, { useMongoClient: true });
mongoose.Promise = Promise;

// initialization (for the new installed site)
require('./schema')._siteConfig.siteInitialization();



// ==============================
//  CONFIG
// ==============================
// express
app.engine('dot', require('./config/_viewEngine').__express);
app.set('x-powered-by', false);
app.set('view engine', 'dot');
app.set('views', path.join(__dirname, './views'));
app.set('partials', {
    theme: path.join(__dirname, './views/theme/_partials'),
    console: path.join(__dirname, './views/console/_partials'),
});
app.use(express.static(path.join(__dirname, './public'), {
    setHeaders: (res, path, stat) => res.set('x-robots-tag', 'none'),
}));
app.use(session({
    secret: process.env.SECRET,
    saveUninitialized: false,
    resave: false,
    // cookie: { secure: true },
    store: new MongoStore({
        mongooseConnection: mongoose.connection,
        autoRemove: 'native',
    }),
}));


// dependencies
if (process.env.ENV === 'dev') app.use(logger('dev'));
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(flash());
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
require('./config/passport')(passport);


// app
//// permanent middleware
app.use(require('./config/middleware').preloadLocals);



// ==============================
//  ROUTES
// ==============================
app.use('/', require('./routes/index'));
app.use('/', require('./routes/authentication'));
app.use('/console', require('./routes/console'));
app.use('/post', require('./routes/post'));
app.use('/seed', require('./routes/seed'));
app.use('/', require('./routes/error'));



// ==============================
//  APP EXPORTS
// ==============================
module.exports = (process.env.ENV === 'test') ? { app, mongoose } : app;
