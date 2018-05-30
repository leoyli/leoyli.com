const env = {
  LANG: 'en',
  DB: 'mongodb://localhost/leoyli-test',
  SECRET: '0VzLX86JAI6sZWJHUyf7P0ZynNXxt2H5',
  NODE_ENV: 'test',
};


// load
process.env = { ...process.env, ...env };
