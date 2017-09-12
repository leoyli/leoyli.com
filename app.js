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
    LocalStrategy           = require('passport-local'),
    passportLocalMongoose   = require('passport-local-mongoose');

var app = express();



// ==============================
//  DB LINKAGE
// ==============================
mongoose.Promise = global.Promise;
mongoose.connect(process.env.DB, {useMongoClient: true});



// ==============================
//  VIEW ENGINE
// ==============================
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');



// ==============================
//  MIDDLEWARE
// ==============================
var middleware              = require('./middleware');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressSanitizer());
app.use(methodOverride('_method'));
app.use(flash());
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));



// ==============================
//  PASSPORT
// ==============================
var UserModel               = require("./models/user");

app.use(require('express-session')({
    secret: process.env.PASSPORT_SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(UserModel.createStrategy());
passport.serializeUser(UserModel.serializeUser());
passport.deserializeUser(UserModel.deserializeUser());



// ==============================
//  ROUTES
// ==============================
var index                   = require('./routes/index'),
    error                   = require('./routes/error');
    // authentication          = require('./routes/authentication'),
    // dashboard               = require('./routes/dashboard'),
    // post                    = require('./routes/post');

app.use('/', index);
// app.use('/', authentication);
// app.use('/dashboard', dashboard);
// app.use('/post', post);

// ** develop only ** //
var seedSample              = require('./routes/seed');
app.use('/seed', seedSample);
// ** develop only ** //

app.use('/', error);


// ==============================
//  APP EXPORTS
// ==============================
module.exports = app;
