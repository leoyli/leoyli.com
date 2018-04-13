const { Device } = require('../controllers/engines/router');
const { _M_ } = require('../controllers/middleware/plugins');
const api = require('../controllers/routers/api');



// device
const APIRouter = new Device([{
  route:          '/stack/:stackType',
  controller:     api.stack,
}]);


// settings
APIRouter.setting = { authenticated : false };
APIRouter.use(_M_.APIHttpHeaders);



// exports
module.exports = APIRouter.run();
