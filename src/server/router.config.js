const { Device } = require('./controllers/drivers/router');
const { pages } = require('./routers/pages');
const { auth } = require('./routers/auth');
const { blog } = require('./routers/blog');
const { util } = require('./routers/util');


// routers
const authRouter = new Device([
  {
    path: '/signin',
    controller: auth.signin,
  },
]);

const pagesRouter = new Device([
  {
    path: '/search/:search',
    controller: pages.search,
  },
]);

const blogRouter = new Device([
  {
    path: '/search/:search',
    controller: blog.search,
  },
  {
    path: '/:key',
    controller: blog.post,
  },
  {
    path: '/',
    controller: blog.list,
  },
]);

const utilRouter = new Device([
  {
    path: '/settings',
    controller: util.settings,
    secure: true,
  },
  {
    path: '/stacks/:collection',
    controller: util.stacks,
    secure: true,
  },
  {
    path: '/upload',
    controller: util.upload,
    secure: true,
  },
]);


// config
const config = [
  ['/', authRouter],
  ['/', pagesRouter],
  ['/util', utilRouter],
  ['/blog', blogRouter],
];


// exports
module.exports = {
  APIRouters: Device.assemble(config),
  authRouter,
  pagesRouter,
  blogRouter,
  utilRouter,
};
