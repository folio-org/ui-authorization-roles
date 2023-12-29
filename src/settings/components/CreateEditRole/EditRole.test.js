import React from 'react';

import userEvent from '@testing-library/user-event';
import { cleanup } from '@testing-library/react';
import { renderWithIntl } from '@folio/stripes-erm-testing';
import { MemoryRouter } from 'react-router';

import translationsProperties from '../../../../test/helpers/translationsProperties';

import '@testing-library/jest-dom';

import EditRole from './EditRole';
import useCapabilities from '../../../hooks/useCapabilities';
import useRoleCapabilities from '../../../hooks/useRoleCapabilities';
import { useEditRoleMutation } from '../../../hooks/useEditRoleMutation';

const mockPutRequest = jest.fn().mockReturnValue({ ok:true });
const mockPostRequest = jest.fn().mockReturnValue({ ok:true });

jest.mock('../../../hooks/useCapabilities');
jest.mock('../../../hooks/useRoleCapabilities');

jest.mock('../../../hooks/useEditRoleMutation', () => ({
  useEditRoleMutation: jest.fn()
}));

const mockMutateFn = jest.fn();
jest.mock('react-query', () => ({
  ...jest.requireActual('react-query'),
  useMutation: () => ({ mutate: mockMutateFn, isLoading: false }),
}));


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

describe('EditRole component', () => {
  const mockMutateRole = jest.fn();
  afterEach(() => {
    cleanup();
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    useEditRoleMutation.mockReturnValue({ mutateRole: mockMutateRole, isLoading: false });
    useCapabilities.mockReturnValue({ capabilitiesList: [], isSuccess: true });
    useRoleCapabilities.mockReturnValue({ initialRoleCapabilitiesSelectedMap: {}, isSuccess: true });
  });

  it('renders TextField and Button components', async () => {
    // useCapabilities.mockReturnValue({ capabilitiesList: [], isSuccess: true });
    // useRoleCapabilities.mockReturnValue({ initialRoleCapabilitiesSelectedMap: {}, isSuccess: true });
    const { getByTestId } = renderWithIntl(
      <MemoryRouter>
        <EditRole refetch={jest.fn()} />
      </MemoryRouter>,
      translationsProperties
    );

    expect(getByTestId('create-role-form')).toBeInTheDocument();
  });

  it('changes name, description input values', async () => {
    const { getByTestId } = renderWithIntl(
      <MemoryRouter>
        <EditRole refetch={jest.fn()} />
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
    const { getByTestId, getByRole } = renderWithIntl(
      <MemoryRouter>
        <EditRole refetch={mockRefetch} />
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
        <EditRole refetch={mockFn} selectedRole={{ id: 1, name: 'Admin', description: 'Administrator role' }} />
      </MemoryRouter>,
      translationsProperties
    );

    const roleNameInput = getByTestId('rolename-input');
    const descriptionInput = getByTestId('description-input');

    expect(roleNameInput.value).toBe('Admin');
    expect(descriptionInput.value).toBe('Administrator role');
  });

  it('onSubmit invalidates "ui-authorization-roles" query and calls goBack on success', async () => {
    const { getByRole, getByTestId } = renderWithIntl(
      <MemoryRouter>
        <EditRole selectedRole={{ id: 1, name: 'Admin', description: 'Administrator role' }} />,
      </MemoryRouter>,
      translationsProperties
    );
    const submitButton = getByRole('button', { name: 'Save and close' });

    await userEvent.type(getByTestId('rolename-input'), 'Change role');

    await userEvent.click(submitButton);
    expect(submitButton).toBeEnabled();
    expect(mockMutateRole).toHaveBeenCalledWith(1);
  });
});
