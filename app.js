// ==============================
//  DEPENDENCIES
// ==============================
const methodOverride = require('method-override');
const session = require('express-session');
const favicon = require('serve-favicon');
const logger = require('morgan');
const MongoStore = require('connect-mongo')(session);
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const express = require('express');
const path = require('path');
const passport = require('passport');
const flash = require('connect-flash');


// ==============================
//  SERVICES
// ==============================
const routingService = require('./routers/');
const viewEngineService = require('./controllers/engines/view');
const passportAgent = require('./services/passport');
const securityHeaderAgent = require('./services/security');


// ==============================
//  DATABASE
// ==============================
/** database **/
mongoose.connect(process.env.DB);
if (process.env.NODE_ENV !== 'test') require('./models/').ConfigsModel.initialize();


// ==============================
//  CONNECTION
// ==============================
const app = express();


/** security **/
securityHeaderAgent(app);


/** static public resources **/
app.use('/src', express.static(path.join(__dirname, './src/public'), {
  setHeaders: (res) => res.set('x-robots-tag', 'none'),
}));


/** session **/
app.use(session({
  name: '__SESSION__',
  secret: process.env.SECRET,
  saveUninitialized: false,
  resave: false,
  cookie: (process.env.NODE_ENV === 'test') ? {} : { secure: true, httpOnly: true },                                    // note: secure === true only allows HTTPS and leading to test fail
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    autoRemove: 'native',
  }),
}));


/** passport **/
passportAgent(passport);


/** static private resources **/
// todo: handle the authentication for the resources
app.use('/src', express.static(path.join(__dirname, './src/private'), {
  setHeaders: (res) => res.set('x-robots-tag', 'none'),
}));


/** debugger **/
if (process.env.NODE_ENV === 'dev') app.use(logger('dev'));


/** API **/
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: 'application/json' }));
app.use('/api', routingService.APIRouter);


/** HTML **/
app.engine('dot', viewEngineService.__express);
app.set('view engine', 'dot');
app.set('views', path.join(__dirname, './views'));
app.set('upload', path.join(__dirname, './src/public/media'));
app.use(flash());
app.use(methodOverride('_method'));
app.use(favicon(path.join(__dirname, './src/public', 'favicon.ico')));
app.use('/', routingService.HTMLRouter);


/** Last-ditch **/
app.use((err, req, res, next) => {
  console.log(err);
  return res.sendStatus(500);
});


// exports
module.exports = (process.env.NODE_ENV === 'test') ? { app, mongoose } : app;
