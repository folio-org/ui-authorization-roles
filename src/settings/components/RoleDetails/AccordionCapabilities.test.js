import { cleanup, render } from '@folio/jest-config-stripes/testing-library/react';
import '@folio/jest-config-stripes/testing-library/jest-dom';
import { useRoleCapabilities } from '@folio/stripes-authorization-components';

import renderWithRouter from '../../../../test/jest/helpers/renderWithRouter';
import AccordionCapabilities from './AccordionCapabilities';

jest.mock('@folio/stripes-authorization-components', () => ({
  ...jest.requireActual('@folio/stripes-authorization-components'),
  CapabilitiesSection: () => <div>CapabilitiesSection</div>,
  useRoleCapabilities: jest.fn(),
}));

const capCount = 2147483647;

const renderComponent = () => render(
  renderWithRouter(
    <AccordionCapabilities roleId="1" />
  )
);

describe('AccordionCapabilities component', () => {
  afterEach(() => {
    cleanup();
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  describe('displays accordion', () => {
    useRoleCapabilities.mockReturnValue({
      capabilitiesTotalCount: capCount,
      isSuccess: true,
    });

    const { getByText } = renderComponent();

    it('render accordion header', () => {
      getByText('ui-authorization-roles.details.capabilities');
      getByText(capCount);
    });
  });

  it('render loading spinner', () => {
    useRoleCapabilities.mockReturnValue({
      capabilitiesTotalCount: capCount,
      isSuccess: false,
    });

    const { getByText } = renderComponent();

    getByText('Loading');
  });
});
