const { HttpException } = require('../controllers/utilities/')._U_.error;
const { exceptionHandler } = require('../controllers/handlers/error');


const errorHandlingAgent = app => {
  app.use('*', (req, res, next) => next(new HttpException(404)));
  app.use(exceptionHandler);
  app.use((err, req, res, next) => res.sendStatus(500));
};


// exports
module.exports = errorHandlingAgent;
