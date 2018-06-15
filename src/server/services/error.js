const { _U_: { error: { HttpException } } } = require('../controllers/utilities/');
const { exceptionHandler } = require('../controllers/handlers/error');


const errorHandlingAgent = app => {
  app.use('*', (req, res, next) => next(new HttpException(404)));
  app.use(exceptionHandler);
  app.use((err, req, res, next) => {
    console.log(err);
    res.sendStatus(500);
  });
};


// exports
module.exports = errorHandlingAgent;
