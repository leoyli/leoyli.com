const { HttpError }       = require('../controllers/utilities/')._U_.error;
const
  methodOverride          = require('method-override'),
  bodyParser              = require('body-parser'),
  flash                   = require('connect-flash'),
  logger                  = require('morgan'),
  favicon                 = require('serve-favicon');



function _useMiddleware(app) {
  // external
  //app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
  if (process.env['NODE_ENV'] === 'dev') app.use(logger('dev'));
  app.use(methodOverride('_method'));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(flash());

  // internal
  app.use(require('../controllers/middleware/initial'));
}


function _useRoutes(app) {
  // seed
  if (process.env['NODE_ENV'] === 'dev' || 'test') app.use('/seed', require('./seed'));

  // units
  app.use('/api', require('./api'));
  app.use('/admin', require('./admin'));
  app.use('/home', require('./home'));
  app.use('/posts', require('./posts'));
  app.use('/', require('./account'));
  app.use('/', require('./pages'));

  // error
  app.get('*', (req, res, next) => next(new HttpError(404)));
  app.use(require('../controllers/views/error'));
}


function init(app) {
  _useMiddleware(app);
  _useRoutes(app);
}



// exports
module.exports = { init };
