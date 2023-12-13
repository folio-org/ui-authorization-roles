import React from 'react';

import userEvent from '@testing-library/user-event';
import { cleanup } from '@testing-library/react';
import { renderWithIntl } from '@folio/stripes-erm-testing';
import { MemoryRouter } from 'react-router';

import translationsProperties from '../../../../test/helpers/translationsProperties';

import '@testing-library/jest-dom';

import CreateEditRole from './CreateEditRole';
import useCapabilities from '../../../hooks/useCapabilities';
import useRoleCapabilities from '../../../hooks/useRoleCapabilities';

const mockPutRequest = jest.fn().mockReturnValue({ ok:true });
const mockPostRequest = jest.fn().mockReturnValue({ ok:true });

jest.mock('../../../hooks/useCapabilities');
jest.mock('../../../hooks/useRoleCapabilities');

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useOkapiKy: () => ({
    put: mockPutRequest,
    post: mockPostRequest
  }),
  Pluggable: () => <div>Pluggable</div>
}));

function mockFunction() {
  const original = jest.requireActual('react-router-dom');
  return {
    ...original,
    useLocation: jest.fn().mockReturnValue({
      pathname: '/another-route',
      search: '',
      hash: '',
      state: null,
      key: '5nvxpbdafa',
    }),
  };
}

jest.mock('react-router-dom', () => mockFunction());

jest.mock('@folio/stripes/components', () => {
  const original = jest.requireActual('@folio/stripes/components');
  return {
    ...original,
    Layer: jest.fn(({ children }) => <div data-testid="mock-layer">{children}</div>)
  };
});

describe('CreateEditRole component', () => {
  afterEach(() => {
    cleanup();
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('renders TextField and Button components', async () => {
    useCapabilities.mockReturnValue({ capabilitiesList: [], isSuccess: true });
    useRoleCapabilities.mockReturnValue({ initialRoleCapabilitiesSelectedMap: {}, isSuccess: true });
    const { getByTestId } = renderWithIntl(
      <MemoryRouter>
        <CreateEditRole refetch={jest.fn()} />
      </MemoryRouter>,
      translationsProperties
    );

    expect(getByTestId('create-role-form')).toBeInTheDocument();
  });

  it('changes name, description input values', async () => {
    useCapabilities.mockReturnValue({ capabilitiesList: [], isSuccess: true });
    useRoleCapabilities.mockReturnValue({ initialRoleCapabilitiesSelectedMap: {}, isSuccess: true });
    const { getByTestId } = renderWithIntl(
      <MemoryRouter>
        <CreateEditRole refetch={jest.fn()} />
      </MemoryRouter>,
      translationsProperties
    );

    const nameInput = getByTestId('rolename-input');
    const descriptionInput = getByTestId('description-input');

    await userEvent.type(nameInput, 'New Role');
    await userEvent.type(descriptionInput, 'Description');

    expect(nameInput).toHaveValue('New Role');
    expect(descriptionInput).toHaveValue('Description');
  });

  it('actions on click footer buttons', async () => {
    const mockRefetch = jest.fn();
    useCapabilities.mockReturnValue({ capabilitiesList: [], isSuccess: true });
    useRoleCapabilities.mockReturnValue({ initialRoleCapabilitiesSelectedMap: {}, isSuccess: true });
    const { getByTestId, getByRole } = renderWithIntl(
      <MemoryRouter>
        <CreateEditRole refetch={mockRefetch} />
      </MemoryRouter>,
      translationsProperties
    );

    const submitButton = getByRole('button', { name: 'Save and close' });
    const cancelButton = getByRole('button', { name: 'Cancel' });

    expect(submitButton).toBeDisabled();
    expect(cancelButton).toBeInTheDocument();

    await userEvent.type(getByTestId('rolename-input'), 'New Role');

    expect(submitButton).toBeEnabled();
  });

  it('should set role name and description when selectedRole is truthy', () => {
    const mockFn = jest.fn();
    const { getByTestId } = renderWithIntl(
      <MemoryRouter>
        <CreateEditRole refetch={mockFn} selectedRole={{ id: 1, name: 'Admin', description: 'Administrator role' }} />
      </MemoryRouter>,
      translationsProperties
    );

    const roleNameInput = getByTestId('rolename-input');
    const descriptionInput = getByTestId('description-input');

    expect(roleNameInput.value).toBe('Admin');
    expect(descriptionInput.value).toBe('Administrator role');
  });

  it('should call ky.put with correct parameters and refetchAndGoBack when onEditRole is called with a valid role', async () => {
    const mockRefetch = jest.fn();
    useCapabilities.mockReturnValue({ capabilitiesList: [], isSuccess: true });
    useRoleCapabilities.mockReturnValue({ initialRoleCapabilitiesSelectedMap: {}, isSuccess: true });
    const { getByTestId, getByRole } = renderWithIntl(
      <MemoryRouter>
        <CreateEditRole refetch={mockRefetch} selectedRole={{ id: 1, name: 'Admin', description: 'Administrator role' }} />
      </MemoryRouter>,
      translationsProperties
    );

    await userEvent.type(getByTestId('rolename-input'), 'New Role111');
    await userEvent.click(getByRole('button', { name: 'Save and close' }));

    expect(mockPutRequest).toHaveBeenCalled();
  });

  it('should call ky.put with correct parameters and refetchAndGoBack when onEditRole is called with a valid role', async () => {
    const mockRefetch = jest.fn();
    useCapabilities.mockReturnValue({ capabilitiesList: [], isSuccess: true });
    useRoleCapabilities.mockReturnValue({ initialRoleCapabilitiesSelectedMap: {}, isSuccess: true });
    const { getByTestId, getByRole } = renderWithIntl(
      <MemoryRouter>
        <CreateEditRole refetch={mockRefetch} />
      </MemoryRouter>,
      translationsProperties
    );

    await userEvent.type(getByTestId('rolename-input'), 'New Role');
    await userEvent.type(getByTestId('description-input'), 'Description');
    await userEvent.click(getByRole('button', { name: 'Save and close' }));

    expect(mockPostRequest).toHaveBeenCalledWith('roles', { json:{ name:'New Role', description: 'Description' } });
    expect(mockRefetch).toHaveBeenCalled();
  });
});
