import React from 'react';

import userEvent from '@testing-library/user-event';
import { cleanup } from '@testing-library/react';

import '@testing-library/jest-dom';
import { render } from '@folio/jest-config-stripes/testing-library/react';

import EditRole from './EditRole';
import useCapabilities from '../../../hooks/useCapabilities';
import useRoleCapabilities from '../../../hooks/useRoleCapabilities';
import useEditRoleMutation from '../../../hooks/useEditRoleMutation';
import useRoleById from '../../../hooks/useRoleById';
import renderWithRouter from '../../../../test/jest/helpers/renderWithRouter';

const mockPutRequest = jest.fn().mockReturnValue({ ok:true });
const mockPostRequest = jest.fn().mockReturnValue({ ok:true });

jest.mock('../../../hooks/useCapabilities');
jest.mock('../../../hooks/useRoleCapabilities');
jest.mock('../../../hooks/useRoleById');

jest.mock('../../../hooks/useEditRoleMutation', () => ({
  __esModule: true,
  default: jest.fn()
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
    useCapabilities.mockReturnValue({ groupedCapabilitiesByType: { settings: [
      {
        id: '8d2da27c-1d56-48b6-9534218d-2bfae6d79dc8',
        applicationId: 'Inventory-2.0',
        name: 'foo_item.delete',
        description: 'Settings: Delete foo item',
        resource: 'Settings source',
        action: 'edit',
        type: 'settings',
        permissions: ['foo.item.post'],
      },
    ] },
    isSuccess: true });
    useRoleCapabilities.mockReturnValue({ initialRoleCapabilitiesSelectedMap: { '8d2da27c-1d56-48b6-9534218d-2bfae6d79dc8': true }, isSuccess: true });
    useRoleById.mockReturnValue({ roleDetails: { id: '1', name: 'Admin', description: 'Description' }, isRoleDetailsLoaded: true });
  });

  it('renders TextField and Button components', async () => {
    const { getByTestId } = render(renderWithRouter(
      <EditRole roleId="1" />
    ));

    expect(getByTestId('create-role-form')).toBeInTheDocument();
  });

  it('changes name, description input values', async () => {
    const { getByTestId } = render(renderWithRouter(
      <EditRole roleId="1" />
    ));

    const nameInput = getByTestId('rolename-input');
    const descriptionInput = getByTestId('description-input');

    await userEvent.type(nameInput, ' New Role');
    await userEvent.type(descriptionInput, ' changed');

    expect(nameInput).toHaveValue('Admin New Role');
    expect(descriptionInput).toHaveValue('Description changed');
  });

  it('actions on click footer buttons', async () => {
    const { getByTestId, getByRole } = render(renderWithRouter(
      <EditRole roleId="1" />
    ));

    const submitButton = getByRole('button', { name: 'ui-authorization-roles.crud.saveAndClose' });
    const cancelButton = getByRole('button', { name: 'ui-authorization-roles.crud.cancel' });

    expect(cancelButton).toBeInTheDocument();

    await userEvent.type(getByTestId('rolename-input'), 'New Role');

    expect(submitButton).toBeEnabled();
  });

  it('should set role name and description when selectedRole is truthy', () => {
    const { getByTestId } = render(renderWithRouter(
      <EditRole roleId="1" />
    ));

    const roleNameInput = getByTestId('rolename-input');
    const descriptionInput = getByTestId('description-input');

    expect(roleNameInput.value).toBe('Admin');
    expect(descriptionInput.value).toBe('Description');
  });

  it('onSubmit invalidates "ui-authorization-roles" query and calls goBack on success', async () => {
    const { getByRole, getByTestId } = render(renderWithRouter(
      <EditRole roleId="1" />
    ));
    const submitButton = getByRole('button', { name: 'ui-authorization-roles.crud.saveAndClose' });

    await userEvent.type(getByTestId('rolename-input'), 'Change role');

    await userEvent.click(submitButton);
    expect(submitButton).toBeEnabled();
    expect(mockMutateRole).toHaveBeenCalledTimes(1);
  });

  it('renders initial checkboxes states correctly', () => {
    const { getByRole, getAllByRole } = render(renderWithRouter(
      <EditRole roleId="1" />
    ));
    expect(getAllByRole('checkbox')).toHaveLength(1);

    expect(getByRole('checkbox')).toBeChecked();
  });
  it('correctly sets unchecked state of checkbox on click', async () => {
    const { getByRole, getAllByRole } = render(renderWithRouter(
      <EditRole roleId="1" />
    ));
    expect(getAllByRole('checkbox')).toHaveLength(1);

    await userEvent.click(getByRole('checkbox'));

    expect(getByRole('checkbox')).not.toBeChecked();
  });
});
