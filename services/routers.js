const { adminRouter, homeRouter, postsRouter, accountRouter, pagesRouter } = require('../routers/');
const { HttpError } = require('../controllers/utilities/')._U_.error;



// main
const routerAgent = (app) => {
  app.use('/admin',   adminRouter);
  app.use('/home',    homeRouter);
  app.use('/posts',   postsRouter);
  app.use('/',        accountRouter);
  app.use('/',        pagesRouter);
  app.get('*',        (req, res, next) => next(new HttpError(404)));
  app.use(require('../controllers/views/error'));
};



// exports
module.exports = routerAgent;
