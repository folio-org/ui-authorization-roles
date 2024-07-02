import { cleanup, render } from '@folio/jest-config-stripes/testing-library/react';
import '@folio/jest-config-stripes/testing-library/jest-dom';
import { useRoleCapabilitySets } from '@folio/stripes-authorization-components';

import renderWithRouter from '../../../../test/jest/helpers/renderWithRouter';
import AccordionCapabilitySets from './AccordionCapabilitySets';

jest.mock('../../../hooks', () => ({
  ...jest.requireActual('../../../hooks'),
  useRoleCapabilitySets: jest.fn(),
}));
jest.mock('@folio/stripes-authorization-components', () => ({
  ...jest.requireActual('@folio/stripes-authorization-components'),
  CapabilitiesSection: () => <div>CapabilitiesSection</div>,
  useRoleCapabilitySets: jest.fn(),
}));

const capCount = 2147483647;

const renderComponent = () => render(
  renderWithRouter(
    <AccordionCapabilitySets roleId="1" />
  )
);

describe('AccordionCapabilitySets component', () => {
  afterEach(() => {
    cleanup();
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  describe('displays accordion', () => {
    useRoleCapabilitySets.mockReturnValue({
      capabilitySetsTotalCount: capCount,
      isSuccess: true,
    });

    const { getByText } = renderComponent();

    it('render accordion header', () => {
      getByText('ui-authorization-roles.details.capabilitySets');
      getByText(capCount);
    });
  });

  it('render loading spinner', () => {
    useRoleCapabilitySets.mockReturnValue({
      capabilitiesTotalCount: capCount,
      isSuccess: false,
    });

    const { getByText } = renderComponent();

    getByText('Loading');
  });
});
