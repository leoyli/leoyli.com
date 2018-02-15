// ==============================
//  DEPENDENCIES
// ==============================
const
    path                    = require('path'),
    express                 = require('express'),
    session                 = require('express-session'),
    mongoose                = require('mongoose'),
    MongoStore              = require('connect-mongo')(session),
    passport                = require('passport'),
    app = express();



// ==============================
//  SERVER
// ==============================
// security
app.set('x-powered-by', false);


// static   // note: have to set prior to the session
app.use(express.static(path.join(__dirname, './public'), {
    setHeaders: (res, path, stat) => res.set('x-robots-tag', 'none'),
}));


// dynamic
app.engine('dot', require('./controllers/views/engine').__express);
app.set('view engine', 'dot');
app.set('views', path.join(__dirname, './views'));
app.set('partials', {
    panel: path.join(__dirname, './views/home/_partials'),
    theme: path.join(__dirname, './views/theme/_partials'),
});



// ==============================
//  DATABASE
// ==============================
// connection
mongoose.connect(process.env.DB);


// initialization
mongoose.Promise = Promise;
const { settingModel, userModel } = require('./models');
if (process.env.NODE_ENV !== 'test') settingModel.initialize();


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


// passport
passport.use(userModel.createStrategy());
passport.serializeUser(userModel.serializeUser());
passport.deserializeUser(userModel.deserializeUser());



// ==============================
//  ROUTES
// ==============================
require('./routers').init(app);



// ==============================
//  APP EXPORTS
// ==============================
module.exports = (process.env.NODE_ENV === 'test') ? { app, mongoose } : app;
