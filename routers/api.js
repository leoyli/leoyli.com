const { Device } = require('../controllers/engines/router');
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



// router exports
module.exports = APIRouter.run();
