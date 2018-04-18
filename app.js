// ==============================
//  DEPENDENCIES
// ==============================
const
  path                    = require('path'),
  express                 = require('express'),
  mongoose                = require('mongoose'),
  session                 = require('express-session'),
  MongoStore              = require('connect-mongo')(session),
  passport                = require('passport'),
  logger                  = require('morgan'),
  bodyParser              = require('body-parser'),
  flash                   = require('connect-flash'),
  methodOverride          = require('method-override'),
  favicon                 = require('serve-favicon');
  app = express();



// ==============================
//  SERVICES AGENT
// ==============================
const routerAgent         = require('./services/routers');
const passportAgent       = require('./services/passport');
const securityHeaderAgent = require('./services/security');



// ==============================
//  SERVICES QUEUE
// ==============================
/** security **/
securityHeaderAgent(app);


/** static **/
app.use(express.static(path.join(__dirname, './public'), {
  setHeaders: (res, path, stat) => res.set('x-robots-tag', 'none'),
}));


/** database **/
mongoose.connect(process.env['DB']);
if (process.env['NODE_ENV'] !== 'test') require('./models/').configsModel.initialize();


/** session **/
app.use(session({
  name: '__SESSION__',
  secret: process.env['SECRET'],
  saveUninitialized: false,
  resave: false,
  cookie: (process.env['NODE_ENV'] === 'test') ? {} : { secure: true, httpOnly: true },                                 // note: secure === true only allows HTTPS and leading to test fail
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    autoRemove: 'native',
  }),
}));


/** passport **/
passportAgent(passport);


/** debugger **/
if (process.env['NODE_ENV'] === 'dev') app.use(logger('dev'));


/** API **/
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: 'application/json' }));
app.use('/api', require('./routers/').APIRouter);


/** UI **/
app.engine('dot', require('./controllers/engines/view').__express);
app.set('view engine', 'dot');
app.set('views', path.join(__dirname, './views'));
app.set('upload', path.join(__dirname, './public/media'));
app.use(flash());
app.use(methodOverride('_method'));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
if (process.env['NODE_ENV'] === 'dev' || 'test') app.use('/seed', require('./routers/seed'));


/** routers **/
routerAgent(app);


/** error-handlers **/
app.use((err, req, res, next) => res.sendStatus(500));



// exports
module.exports = (process.env['NODE_ENV'] === 'test') ? { app, mongoose } : app;
