const path = require('path');

module.exports = {
  collectCoverage: false,
  collectCoverageFrom: ['**/controllers/**/*.{js}', '!**/controllers/**/index.{js}'],
  testMatch: ['**/__tests__/**/*.test.js?(x)'],
  coveragePathIgnorePatterns: ['/node_modules/', '/__configs__/', '/src/', '/static/', '/view/'],
  testPathIgnorePatterns: ['/node_modules/', '/__configs__/', '/src/', '/static/', '/view/'],
  rootDir: path.join(__dirname, '../../'),
  globals: { __ROOT__: path.join(__dirname, '../../src') },
  setupFiles: [path.join(__dirname, 'env.config.js')],
};
