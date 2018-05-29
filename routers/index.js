const { Device } = require('../controllers/engines/router');


// routers
const initRouter = require('./init');
const authRouter = require('./auth');
const siteRouter = require('./site');
const homeRouter = require('./home');
const blogRouter = require('./blog');
const pageRouter = require('./page');


// service
const routingService = (mode) => {
  return Device.exec(mode, [
    ['/', authRouter],
    ['/init', initRouter],
    ['/site', siteRouter],
    ['/home', homeRouter],
    ['/blog', blogRouter],
    ['/', pageRouter],
  ]);
};


// exports
module.exports = routingService;
