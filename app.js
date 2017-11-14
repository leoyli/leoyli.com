// ==============================
//  DEPENDENCIES
// ==============================
const
    path                    = require('path'),
    express                 = require('express'),
    session                 = require('express-session'),
    mongoose                = require('mongoose'),
    MongoStore              = require('connect-mongo')(session),
    methodOverride          = require('method-override'),
    bodyParser              = require('body-parser'),
    passport                = require('passport'),
    flash                   = require('connect-flash'),
    logger                  = require('morgan'),
    favicon                 = require('serve-favicon'),
    app = express();

const { _siteConfig, userModel } = require('./schema');



// ==============================
//  DATABASE
// ==============================
// connection
mongoose.connect(process.env.DB, { useMongoClient: true });
mongoose.Promise = Promise;


// initialization
_siteConfig.dbInitialize();


// session
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



// ==============================
//  CONFIGURATIONS
// ==============================
// security
app.set('x-powered-by', false);
app.use(express.static(path.join(__dirname, './public'), {
    setHeaders: (res, path, stat) => res.set('x-robots-tag', 'none'),
}));


// view engine
app.engine('dot', require('./config/_viewEngine').__express);
app.set('view engine', 'dot');
app.set('views', path.join(__dirname, './views'));
app.set('partials', {
    console: path.join(__dirname, './views/console/_partials'),
    theme: path.join(__dirname, './views/theme/_partials'),
});


// passport
passport.use(userModel.createStrategy());
passport.serializeUser(userModel.serializeUser());
passport.deserializeUser(userModel.deserializeUser());


// accessories
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
if (process.env.ENV === 'dev') app.use(logger('dev'));
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(flash());



// ==============================
//  ROUTING RULES
// ==============================
// global middleware
app.use(require('./config/middleware')._global);

// seed
if (process.env.ENV === 'dev' || 'test') app.use('/seed', require('./routes/seed'));

// functional
app.use('/console', require('./routes/console'));
app.use('/post', require('./routes/post'));
app.use('/', require('./routes/authentication'));
app.use('/', require('./routes/index'));

// error
app.use('/', require('./routes/error'));



// ==============================
//  APP EXPORTS
// ==============================
module.exports = (process.env.ENV === 'test') ? { app, mongoose } : app;
