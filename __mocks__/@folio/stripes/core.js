import { mockStripesCore } from '@folio/stripes-erm-testing/jest/mocks';

module.exports = {
  ...jest.requireActual('@folio/stripes-core'),
  ...mockStripesCore
};
