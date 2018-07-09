import { fetchData } from './utilities/fetch/lib';
import config from './routers';


// components
const { auth, page, blog, util } = config;


// configs
const authConfigs = [
  {
    path: '/signin',
    exact: true,
    component: auth.signin,
    send: fetchData('/signin'),
  },
  {
    path: '/signout',
    exact: true,
    component: auth.signout,
  },
];

const pageConfigs = [
  {
    path: '/search/:search',
    exact: true,
    component: page.search,
    request: fetchData('/search/:search'),
  },
];

const blogConfigs = [
  {
    path: '/blog',
    exact: true,
    component: blog.list,
    request: fetchData('/blog'),
  },
  {
    path: '/blog/new',
    exact: true,
    component: blog.editor,
    send: fetchData('/blog'),
    secure: true,
  },
  {
    path: '/blog/:key',
    exact: true,
    component: blog.post,
    request: fetchData('/blog/:key'),
  },
  {
    path: '/blog/:key/edit',
    exact: true,
    component: blog.editor,
    request: fetchData('/blog/:key'),
    send: fetchData('/blog/:key'),
    secure: true,
  },
];

const utilConfigs = [
  {
    path: '/util/stacks/posts',
    exact: true,
    component: util.stacks,
    request: fetchData('/util/stacks/:collection'),
    send: fetchData('/util/stacks/:collection'),
    secure: true,
  },
  {
    path: '/util/settings',
    exact: true,
    component: util.settings,
    send: fetchData('/util/settings'),
    secure: true,
  },
];

const rootConfigs = [
  {
    path: '/',
    exact: true,
    component: page.landing,
  },
];


// exports
const routerConfig = [].concat(authConfigs, pageConfigs, blogConfigs, utilConfigs, rootConfigs);
export { routerConfig as default, routerConfig as routers };
