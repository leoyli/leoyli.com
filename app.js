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
    methodOverride          = require('method-override');
    //favicon                 = require('serve-favicon'),
    //passport                = require('passport'),
    //LocalStrategy           = require('passport-local'),
    //passportLocalMongoose   = require('passport-local-mongoose');

var app = express();



// ==============================
//  DB LINKAGE
// ==============================
mongoose.Promise = global.Promise;
mongoose.connect(process.env.DB || 'mongodb://localhost/leoyli-main-dev', {useMongoClient: true});



// ==============================
//  VIEW ENGINE
// ==============================
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');



// ==============================
//  MIDDLEWARE
// ==============================
var middleware = require('./middleware');

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
// app.use(require('express-session')({
//     secret: 'to-be-defined',
//     resave: false,
//     saveUninitialized: false
// }));
//
// app.use(passport.initialize());
// app.use(passport.session());



// ==============================
//  ROUTES
// ==============================
var index = require('./routes/index');

app.use('/', index);



// ==============================
//  ERRORS CONTROL
// ==============================
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});



// ==============================
//  APP EXPORTS
// ==============================
module.exports = app;
