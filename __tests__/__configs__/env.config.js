const env = {
  DB: 'mongodb://localhost/leoyli-test',
  SECRET: '0VzLX86JAI6sZWJHUyf7P0ZynNXxt2H5',
  NODE_ENV: 'test',
  $WEBSITE_CONFIGS: 'null',
};


// load
process.env = { ...process.env, ...env };
