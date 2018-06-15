import https from 'https';
import fetch from 'node-fetch';


// components
import Blog from '../routers/blog';
import Landing from '../routers/landing';


const index = [
  {
    path: '/blog',
    exact: true,
    component: Blog,
    fetch: (path) => fetch(
      `https://localhost:3443/api${path}`,
      { agent: new https.Agent({ rejectUnauthorized: false }) },
    ).then(res => res.json()),
  },
  {
    path: '/',
    exact: true,
    component: Landing,
  },
];


export { index as default, index as routers };
