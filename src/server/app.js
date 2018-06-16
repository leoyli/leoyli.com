const qs = require('qs');
const session = require('express-session');
const favicon = require('serve-favicon');
const logger = require('morgan');
const MongoStore = require('connect-mongo')(session);
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const express = require('express');
const path = require('path');
const jwt = require('express-jwt');
const jwks = require('jwks-rsa');
const flash = require('connect-flash');


// MODULE
const { _M_ } = require('./controllers/modules/');
const { _U_ } = require('./controllers/utilities/');
const { ConfigsModel } = require('./models/');
const { serverSideRendering } = require('./engines/view');
const routingService = require('./routers/');
const securityHeaderAgent = require('./services/security');
const errorHandlingAgent = require('./services/error');


// CONNECTION
const app = express();


/** setting **/
app.set('env', 'development');
app.set('query parser', str => {
  return _U_.object.burstArrayDeep(qs.parse(str, { parseArrays: false, depth: 0 }), { mutate: true, position: -1 });
});


/** database **/
mongoose.connect(process.env.DB).then(() => ConfigsModel.initConfig(app));


/** security **/
securityHeaderAgent(app);


/** static public resources **/
app.set('upload', path.resolve('./static/public/media'));
app.use('/static', express.static(path.resolve('./static/public'), {
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


/** authentication **/
const jwtCheck = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: process.env.AUTH0_JWKS,
  }),
  audience: process.env.AUTH0_AUDIENCE,
  issuer: process.env.AUTH0_ISSUER,
  algorithms: ['RS256'],
});


/** static private resources **/
app.use('/static', _M_.isSignedIn, express.static(path.resolve('./static/private'), {
  setHeaders: (res) => res.set('x-robots-tag', 'none'),
}));


/** debugger **/
if (process.env.NODE_ENV === 'development') app.use(logger('dev'));


/** API **/
// app.use(jwtCheck);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: 'application/json' }));
app.use('/api', routingService('API'));


/** HTML **/
app.use(flash());
app.use(favicon(path.resolve('./static/public/media', 'favicon.ico')));
app.use(serverSideRendering);


/** error **/
errorHandlingAgent(app);


// exports
module.exports = (process.env.NODE_ENV === 'test') ? { app, mongoose } : app;
