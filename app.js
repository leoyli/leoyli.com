// ==============================
//  APP INITIALIZATION
// ==============================
const
    express                 = require('express'),
    expressSanitizer        = require('express-sanitizer'),
    flash                   = require('connect-flash'),
    path                    = require('path'),
    logger                  = require('morgan'),
    cookieParser            = require('cookie-parser'),
    bodyParser              = require('body-parser'),
    mongoose                = require("mongoose"),
    methodOverride          = require('method-override'),
    favicon                 = require('serve-favicon'),
    passport                = require('passport'),
    app = express();



// ==============================
//  DB
// ==============================
// connection
mongoose.connect(process.env.DB, {useMongoClient: true});
mongoose.Promise = Promise;

// initialization (for the new installed site)
require('./models/_siteConfig').siteInitialization();



// ==============================
//  CONFIG
// ==============================
// express
app.set('x-powered-by', false);
app.set('view engine', 'dot');
app.set('views', path.join(__dirname, './views'));
app.set('consolePartials', path.join(__dirname, './views/console/_partials'));
app.set('partials', path.join(__dirname, './views/theme/_partials'));
app.engine('dot', require('./config/_viewEngine').__express);


// dependencies
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, './public')));
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressSanitizer());
app.use(flash());
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
require('./config/passport')(app, passport);


// app
//// permanent methods
require('./config/methods').extendStringPrototypeMethods();

//// permanent middleware
app.use(require('./config/middleware').preloadLocals);



// ==============================
//  ROUTES
// ==============================
const
    index                   = require('./routes/index'),
    error                   = require('./routes/error'),
    authentication          = require('./routes/authentication'),
    appconsole              = require('./routes/console'),
    post                    = require('./routes/post');

app.use('/', index);
app.use('/', authentication);
app.use('/console', appconsole);
app.use('/post', post);

// ** develop only ** //
const seedSample            = require('./routes/seed');
app.use('/seed', seedSample);
// ** develop only ** //

app.use('/', error);


// ==============================
//  APP EXPORTS
// ==============================
module.exports = app;
