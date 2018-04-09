const { Device } = require('../controllers/engines/router');
const { _M_ } = require('../controllers/middleware/plugins');
const api = require('../controllers/routers/api');



// ==============================
//  ROUTE HUB
// ==============================
const APIRouter = new Device([{
  route:          '/stack/:stackType',
  controller:     api.stack,
}]);


// pre-used middleware
APIRouter.setting = { authenticated : false };
APIRouter.use(_M_.APIHttpHeaders);


// router exports
module.exports = APIRouter.run();
