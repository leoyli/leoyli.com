import config from './routers';


// components
const { auth, page, blog, util } = config;


// configs
const authConfigs = [
  {
    component: auth.signin,
    path: '/signin',
    sendPath: '/signin',
    exact: true,
  },
  {
    component: auth.signout,
    path: '/signout',
    exact: true,
  },
];

const pageConfigs = [
  {
    component: page.search,
    path: '/search/:search',
    fetchPath: '/search/:search',
    exact: true,
  },
];

const blogConfigs = [
  {
    component: blog.list,
    path: '/blog',
    fetchPath: '/blog',
    exact: true,
  },
  {
    component: blog.editor,
    path: '/blog/new',
    sendPath: '/blog',
    exact: true,
    secure: true,
  },
  {
    component: blog.post,
    path: '/blog/:key',
    fetchPath: '/blog/:key',
    exact: true,
  },
  {
    component: blog.editor,
    path: '/blog/:key/edit',
    fetchPath: '/blog/:key',
    exact: true,
    secure: true,
  },
];

const utilConfigs = [
  {
    component: util.stacks,
    path: '/util/stacks/posts',
    fetchPath: '/util/stacks/:collection',
    exact: true,
    secure: true,
  },
  {
    component: util.settings,
    path: '/util/settings',
    sendPath: '/util/settings',
    exact: true,
    secure: true,
  },
];

const rootConfigs = [
  {
    component: page.landing,
    path: '/',
    exact: true,
  },
];


// exports
const routerConfig = [].concat(authConfigs, pageConfigs, blogConfigs, utilConfigs, rootConfigs);
export { routerConfig as default, routerConfig as routers };
