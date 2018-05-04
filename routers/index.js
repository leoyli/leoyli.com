const { _M_ } = require('../controllers/modules');
const { Device } = require('../controllers/engines/router');
const { HttpException } = require('../controllers/utilities/')._U_.error;
const errorHandler = require('../controllers/views/error');


const routerIndex = {
  APIRouter: require('./api/api'),
  initRouter: require('./init'),
  authRouter: require('./auth'),
  siteRouter: require('./html/site'),
  homeRouter: require('./html/home'),
  blogRouter: require('./html/blog'),
  pageRouter: require('./html/page'),
};


const routerHub = new Device()
  .use('/init', routerIndex.initRouter)
  .use('/site', routerIndex.siteRouter)
  .use('/home', routerIndex.homeRouter)
  .use('/blog', routerIndex.blogRouter)
  .use('/', routerIndex.authRouter)
  .use('/', routerIndex.pageRouter)
  .use('*', [_M_.responseHTMLRequest, (req, res, next) => next(new HttpException(404))])
  .use(errorHandler)
  .router;


// exports
module.exports = { HTMLRouter: routerHub, ...routerIndex };
