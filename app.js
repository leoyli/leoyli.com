// ==============================
//  APP INITIALIZATION
// ==============================
const
    express                 = require('express'),
    expressSanitizer        = require('express-sanitizer'),
    flash                   = require('connect-flash'),
    dot                     = require('dot'),
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
//  DB LINKAGE
// ==============================
mongoose.connect(process.env.DB, {useMongoClient: true});

// new site registration
const _siteConfig           = require('./models/_siteConfig');
_siteConfig.newSiteConfig();



// ==============================
//  CONFIG
// ==============================
// view engine
app.set('view engine', 'dot');
app.set('views', path.join(__dirname, './views'));
app.set('partials', path.join(__dirname, './views/partial/'));
app.engine('dot', require('./config/_viewEngine').__express);


// required packages
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressSanitizer());
app.use(methodOverride('_method'));
app.use(flash());
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));


// mongoose promise
mongoose.Promise = Promise; // note: use ES6 native promise


// passport
const passportConfig        = require('./config/passport');
passportConfig(app, passport);


// middleware
const middleware            = require('./config/middleware');
app.use(middleware.localVariables);



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
