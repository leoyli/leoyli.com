/* eslint-disable key-spacing */
const { Device } = require('../../controllers/engines/router');
const api = require('../../controllers/routers/api');


// device
const APIRouter = new Device([
  {
    route:        '/stack/:stackType',
    controller:   api.stack,
  },
]);


// settings
APIRouter.setting = { servingAPI: true, authentication: false };


// exports
module.exports = APIRouter.run();
