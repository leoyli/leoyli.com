const path = require('path');

module.exports = {
  rootDir: path.join(__dirname, '../'),
  globals: { __ROOT__: path.join(__dirname, '../../') },
  testPathIgnorePatterns: ['/node_modules/', '/__configs__/'],
  setupFiles: [path.join(__dirname, 'env.config.js')],
};
