import { cleanup, render } from '@folio/jest-config-stripes/testing-library/react';
import '@folio/jest-config-stripes/testing-library/jest-dom';

import AccordionCapabilitySets from './AccordionCapabilitySets';
import useRoleCapabilitySets from '../../../hooks/useRoleCapabilitySets';

import renderWithRouter from '../../../../test/jest/helpers/renderWithRouter';

jest.mock('../../../hooks/useRoleCapabilitySets');

jest.mock('../Capabilities/CapabilitiesSection', () => ({
  CapabilitiesSection: () => <div>CapabilitiesSection</div>,
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
