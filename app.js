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
app.engine('dot', require('./controllers/engines/view').__express);
app.set('view engine', 'dot');
app.set('views', path.join(__dirname, './views'));


// ==============================
//  DATABASE
// ==============================
// connection
mongoose.connect(process.env['DB']);


// initialization
const { configsModel, usersModel } = require('./models/');
if (process.env['NODE_ENV'] !== 'test') configsModel.initialize();


// session
app.use(session({
  secret: process.env['SECRET'],
  saveUninitialized: false,
  resave: false,
  // cookie: { secure: true },
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    autoRemove: 'native',
  }),
}));


// passport
passport.use(usersModel.createStrategy());
passport.serializeUser(usersModel.serializeUser());
passport.deserializeUser(usersModel.deserializeUser());



// ==============================
//  ROUTES
// ==============================
require('./routers').init(app);



// ==============================
//  APP EXPORTS
// ==============================
module.exports = (process.env['NODE_ENV'] === 'test') ? { app, mongoose } : app;
