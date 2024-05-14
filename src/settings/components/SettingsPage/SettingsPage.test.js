import React from 'react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import { render } from '@folio/jest-config-stripes/testing-library/react';

import SettingsPage from './SettingsPage';
import useMatchPath from '../../../hooks/useMatchPath';

import useAuthorizationRoles from '../../../hooks/useAuthorizationRoles';
import useRoleCapabilities from '../../../hooks/useRoleCapabilities';
import renderWithRouter from '../../../../test/jest/helpers/renderWithRouter';

jest.mock('../../../hooks/useCapabilities');
jest.mock('../../../hooks/useRoleCapabilities');
jest.mock('../../../hooks/useMatchPath');

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

  beforeEach(() => {
    useMatchPath.mockClear().mockImplementation(() => ({
      getParams: () => ({})
    }));
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
    const { getByText, getAllByRole, getByTestId, queryByTestId } = renderComponent();

    expect(getByText('+ ui-authorization-roles.new')).toBeInTheDocument();
    expect(getByTestId('search-field')).toBeInTheDocument();

    expect(getAllByRole('gridcell')).toHaveLength(4);
    expect(getByText('Test Role')).toBeInTheDocument();
    expect(getByText('Test role description')).toBeInTheDocument();

    expect(queryByTestId('mock-role-details')).not.toBeInTheDocument();
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

  it('renders role details if role id present in the path', async () => {
    useMatchPath.mockClear().mockReturnValue({ getParams: () => ({ roleId: 'id' }) });
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
    const { queryByTestId } = renderComponent();

    expect(queryByTestId('mock-role-details')).toBeInTheDocument();
  });

  it('filter roles on search', async () => {
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
      onSubmitSearch: mockFilterRoles
    }));
    const { queryByTestId, getByRole } = renderComponent();

    const inputElement = queryByTestId('search-field');

    await userEvent.type(inputElement, 'Test');
    await userEvent.click(getByRole('button', { name: 'ui-authorization-roles.search' }));

    expect(mockFilterRoles).toHaveBeenCalled();
  });
});
