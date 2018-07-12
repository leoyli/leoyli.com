const qs = require('qs');
const session = require('express-session');
const favicon = require('serve-favicon');
const logger = require('morgan');
const MongoStore = require('connect-mongo')(session);
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const express = require('express');
const path = require('path');


// MODULE
const { _M_ } = require('./controllers/modules');
const { _U_ } = require('./utilities/');
const { ConfigsModel } = require('./models/');
const { APIRouters } = require('./router.config');


// CONNECTION
const app = express();


/** database **/
mongoose.connect(process.env.DB).then(() => ConfigsModel.initConfig(app));


/** setting **/
app.set('x-powered-by', false);
app.set('env', process.env.NODE_ENV);
app.set('upload', path.resolve('./static/public/media'));
app.set('query parser', str => {
  return _U_.object.burstArrayDeep(qs.parse(str, { parseArrays: false, depth: 0 }), { mutate: true, position: -1 });
});


/** security **/
app.use(_M_.securityHeaders);


/** session **/
app.use(session({
  name: 'session_id',
  secret: process.env.SESSION_SECRET,
  saveUninitialized: false,
  rolling: false,
  resave: false,
  cookie: (process.env.NODE_ENV !== 'test')
    ? { secure: process.NODE_ENV === 'production', httpOnly: true, sameSite: true }
    : {},
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    autoRemove: 'native',
  }),
}));


/** static public resources **/
app.use(favicon(path.resolve('./static/public/media', 'favicon.ico')));
app.use('/static', express.static(path.resolve('./static/public')));
app.use('/static', _M_.JWTAuthentication, express.static(path.resolve('./static/private')), (err, req, res, next) => {
  if (err.name === 'UnauthorizedError') return next();
});


/** debugger **/
if (process.env.NODE_ENV === 'development') app.use(logger('dev'));


/** routers **/
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: 'application/json' }));
app.use(_M_.appConfigsLoader);


/** auth endpoint **/
app.get('/signout', (req, res, next) => {
  if (req.session.accessToken) req.session.destroy();
  next();
});


/** API endpoints **/
app.use('/api', APIRouters, (err, req, res, next) => {
  console.log(err);
  switch (err.name) {
    case 'UnauthorizedError':
      return res.status(401).json({
        _error: err.name,
        _status: 401,
      });
    case 'ValidationError':
      return res.status(400).json({
        _error: err.name,
        _status: 400,
      });
    case 'HttpException':
      return res.status(404).json({
        _error: err.name,
        _status: 404,
      });
    default: {
      return res.status(500).json({
        _error: 'InternalServerError',
        _status: 500,
      });
    }
  }
});


/** SSR endpoint **/
app.use(_M_.serverSideRenderer);
app.use((err, req, res, next) => {
  console.log(err);
  res.send('HTTP 500 - InternalServerError');
});


// exports
module.exports = app;
