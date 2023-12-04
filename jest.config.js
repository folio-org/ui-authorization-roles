const jestConf = require('@folio/stripes-erm-testing/jest.config');
const path = require('path');

module.exports = {
  ...jestConf,
  testEnvironment: 'jsdom',
  resolver: path.join(__dirname, './test/jest/resolver.js'),
};
