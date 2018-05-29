const env = {
  DB: 'mongodb://localhost/leoyli-test',
  SECRET: '0VzLX86JAI6sZWJHUyf7P0ZynNXxt2H5',
  NODE_ENV: 'test',
  $WEBSITE_CONFIGS: JSON.stringify({
    _id: '000000000000000000000000',
    active: true,
    title: 'TestSite',
    description: 'This is a test env.',
    keywords: 'test',
    sets: {
      imageTypes: [['gif'], ['jpe?g'], ['png'], ['svg'], ['tiff'], ['webp']],
      timezone: 'UTC−07:00 (MST)',
      timeFormat: 'YYYY-MM-DD',
      language: 'en',
      sort: '',
      num: 5,
    },
    time: {
      _created: '2018-01-01T00:00:00.000Z',
      _updated: '2018-01-01T00:00:00.000Z',
    },
  }),
};


// load
process.env = { ...process.env, ...env };
