// ==============================
//  APP INITIALIZATION
// ==============================
var express                 = require('express'),
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
//  DB LINKAGE
// ==============================
mongoose.Promise = global.Promise;
mongoose.connect(process.env.DB, {useMongoClient: true});



// ==============================
//  CONFIG
// ==============================
// view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


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


// passport
var passportConfig          = require('./config/passport');
passportConfig(app, passport);


// middleware
var middleware              = require('./config/middleware');
app.use(middleware.localVariables);



// ==============================
//  ROUTES
// ==============================
var index                   = require('./routes/index'),
    error                   = require('./routes/error'),
    authentication          = require('./routes/authentication'),
    console                 = require('./routes/console'),
    post                    = require('./routes/post');

app.use('/', index);
app.use('/', authentication);
app.use('/console', console);
app.use('/post', post);

// ** develop only ** //
var seedSample              = require('./routes/seed');
app.use('/seed', seedSample);
// ** develop only ** //

app.use('/', error);


// ==============================
//  APP EXPORTS
// ==============================
module.exports = app;
