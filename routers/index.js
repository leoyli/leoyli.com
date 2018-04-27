const { _M_ } = require('../controllers/modules');
const { Device } = require('../controllers/engines/router');
const { HttpError } = require('../controllers/utilities/')._U_.error;
const errorHandler = require('../controllers/views/error');


const routerIndex = {
  accountRouter: require('./account'),
  adminRouter: require('./admin'),
  homeRouter: require('./home'),
  postsRouter: require('./posts'),
  pagesRouter: require('./pages'),
  APIRouter: require('./api'),
  seedRouter: require('./seed'),
};


const routerHub = new Device()
  .use('/seed', routerIndex.seedRouter)
  .use('/admin', routerIndex.adminRouter)
  .use('/home', routerIndex.homeRouter)
  .use('/posts', routerIndex.postsRouter)
  .use('/', routerIndex.accountRouter)
  .use('/', routerIndex.pagesRouter)
  .use('*', [_M_.responseHTMLRequest, (req, res, next) => next(new HttpError(404))])
  .use(errorHandler)
  .router;


// exports
module.exports = { HTMLRouter: routerHub, ...routerIndex };
