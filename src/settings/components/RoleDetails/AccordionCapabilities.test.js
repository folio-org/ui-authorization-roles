import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

import { render } from '@folio/jest-config-stripes/testing-library/react';

import AccordionCapabilities from './AccordionCapabilities';
import useRoleCapabilities from '../../../hooks/useRoleCapabilities';

import renderWithRouter from '../../../../test/jest/helpers/renderWithRouter';

jest.mock('../../../hooks/useRoleCapabilities');
jest.mock('../Capabilities/CapabilitiesSection', () => ({
  CapabilitiesSection: () => <div>CapabilitiesSection</div>,
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
