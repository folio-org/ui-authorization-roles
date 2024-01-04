import React from 'react';
import userEvent from '@testing-library/user-event';

import { render } from '@folio/jest-config-stripes/testing-library/react';

import SettingsPage from './SettingsPage';


import useAuthorizationRoles from '../../../hooks/useAuthorizationRoles';

import useCapabilities from '../../../hooks/useCapabilities';
import useRoleCapabilities from '../../../hooks/useRoleCapabilities';
import renderWithRouter from '../../../../test/jest/helpers/renderWithRouter';

jest.mock('../../../hooks/useCapabilities');
jest.mock('../../../hooks/useRoleCapabilities');

useCapabilities.mockReturnValue({ capabilitiesList: [], isSuccess: true });
useRoleCapabilities.mockReturnValue({ initialRoleCapabilitiesSelectedMap: {}, isSuccess: true });

jest.mock('../RoleDetails/RoleDetails', () => () => (
  <div data-testid="mock-role-details">Role details pane</div>
));

jest.mock('@folio/stripes-smart-components', () => ({
  UserName: jest.fn(() => <div>user name</div>),
}));

jest.mock('../../../hooks/useAuthorizationRoles', () => {
  return {
    __esModule: true,
    default: jest.fn(),
  };
});

describe('SettingsPage', () => {
  afterAll(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () => render(renderWithRouter(<SettingsPage />));

  it('renders the SettingsPage component', () => {
    useAuthorizationRoles.mockImplementation(() => ({
      roles: [
        {
          id: 'id',
          name: 'Test Role',
          description: 'Test role description',
          metadata: {
            modifiedDate: '2023-03-14T13:11:59.601+00:00',
            modifiedBy: 'diku, admin',
          },
        },
      ],
    }));
    const { getByText, getAllByRole, getByTestId } = renderComponent();

    expect(getByText('+ ui-authorization-roles.new')).toBeInTheDocument();
    expect(getByTestId('search-field')).toBeInTheDocument();

    expect(getAllByRole('gridcell')).toHaveLength(4);
    expect(getByText('Test Role')).toBeInTheDocument();
    expect(getByText('Test role description')).toBeInTheDocument();
  });

  it('renders dashes on none metadata fields', () => {
    useAuthorizationRoles.mockImplementation(() => ({
      roles: [
        {
          id: 'id',
          name: 'Test Role',
          description: 'Test role description',
          metadata: {},
        },
      ],
    }));

    const { getAllByRole } = renderComponent();

    const gridCells = getAllByRole('gridcell');

    expect(gridCells).toHaveLength(4);
    expect(gridCells[2]).toHaveTextContent('-');
  });

  it('renders role details on click', async () => {
    useAuthorizationRoles.mockImplementation(() => ({
      roles: [
        {
          id: 'id',
          name: 'Test Role',
          description: 'Test role description',
          metadata: {},
        },
      ],
    }));
    const { queryByTestId, getAllByRole } = renderComponent();

    await userEvent.click(getAllByRole('gridcell')[0]);
    expect(queryByTestId('mock-role-details')).toBeInTheDocument();
  });

  it('refetch after on search', async () => {
    const mockFilterRoles = jest.fn();
    useAuthorizationRoles.mockImplementation(() => ({
      roles: [
        {
          id: 'id',
          name: 'Test Role',
          description: 'Test role description',
          metadata: {},
        },
      ],
      filterRoles: mockFilterRoles
    }));
    const { queryByTestId, getByRole } = renderComponent();

    const inputElement = queryByTestId('search-field');

    await userEvent.type(inputElement, 'Test');
    await userEvent.click(getByRole('button', { name: 'ui-authorization-roles.search' }));

    expect(mockFilterRoles).toHaveBeenCalled();
  });
});
