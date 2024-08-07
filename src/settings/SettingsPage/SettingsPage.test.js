import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import { render } from '@folio/jest-config-stripes/testing-library/react';
import {
  useRoleCapabilities,
  useAuthorizationRoles,
} from '@folio/stripes-authorization-components';
import { useChunkedCQLFetch } from '@folio/stripes/core';

import { renderWithRouter } from 'helpers';
import SettingsPage from './SettingsPage';


jest.mock('@folio/stripes-authorization-components', () => ({
  ...jest.requireActual('@folio/stripes-authorization-components'),
  useRoleCapabilities: jest.fn(),
  useAuthorizationRoles: jest.fn(),
  useUsers: jest.fn().mockReturnValue({ users: {} }),
  RoleDetails: () => <div data-testid="mock-role-details">Role details pane</div>,
  SearchForm: ({ onSubmit }) => (
    <div>
      <input data-testid="search-field" />
      <button type="submit" onClick={onSubmit}>ui-authorization-roles.search</button>
    </div>
  ),
}));

useRoleCapabilities.mockReturnValue({ initialRoleCapabilitiesSelectedMap: {}, isSuccess: true });

jest.mock('@folio/stripes-smart-components', () => ({
  UserName: jest.fn(() => <div>user name</div>),
}));

jest.mock('react-router-dom', () => {
  return { ...jest.requireActual('react-router-dom'),
    useParams: jest.fn().mockReturnValue({ id: 'id' }) };
});

describe('SettingsPage', () => {
  beforeEach(() => {
    useChunkedCQLFetch.mockReturnValue({
      items: [],
      isLoading: false,
    });
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () => render(renderWithRouter(<SettingsPage path="/settings/auz-rolez" />));

  it('renders the SettingsPage component', () => {
    useAuthorizationRoles.mockImplementation(() => ({
      roles: [
        {
          id: 'id',
          name: 'Test Role',
          description: 'Test role description',
          metadata: {
            updatedDate: '2023-03-14T13:11:59.601+00:00',
            updatedByUserId: '12345',
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

  it('renders role details if role id present in the path', async () => {
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

    expect(mockFilterRoles).toHaveBeenCalledTimes(1);
  });
});
