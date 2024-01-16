import React from 'react';

import userEvent from '@testing-library/user-event';
import { cleanup } from '@testing-library/react';

import { render } from '@folio/jest-config-stripes/testing-library/react';


import '@testing-library/jest-dom';

import CreateRole from './CreateRole';
import useCapabilities from '../../../hooks/useCapabilities';

import useCreateRoleMutation from '../../../hooks/useCreateRoleMutation';
import renderWithRouter from '../../../../test/jest/helpers/renderWithRouter';


jest.mock('../../../hooks/useCapabilities');
jest.mock('../../../hooks/useCreateRoleMutation', () => ({
  __esModule: true,
  default: jest.fn()
}));

jest.mock('@folio/stripes/components', () => {
  const original = jest.requireActual('@folio/stripes/components');
  return {
    ...original,
    Layer: jest.fn(({ children }) => <div data-testid="mock-layer">{children}</div>)
  };
});

const renderComponent = () => render(renderWithRouter(<CreateRole />));

describe('CreateRole component', () => {
  const mockMutateRole = jest.fn();
  afterEach(() => {
    cleanup();
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    useCreateRoleMutation.mockReturnValue({ mutateRole:mockMutateRole, isLoading: false });
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
        actions: { view: 'foo.item.get', edit: 'foo.item.put', manage: 'foo.item.post' },
      },
    ] },
    isSuccess: true });
  });

  it('renders TextField and Button components', async () => {
    const { getByTestId } = renderComponent();

    expect(getByTestId('create-role-form')).toBeInTheDocument();
  });

  it('changes name, description input values', async () => {
    const { getByTestId } = renderComponent();

    const descriptionInput = getByTestId('description-input');
    const nameInput = getByTestId('rolename-input');

    await userEvent.type(nameInput, 'New Role');
    await userEvent.type(descriptionInput, 'Description');

    expect(nameInput).toHaveValue('New Role');
    expect(descriptionInput).toHaveValue('Description');
  });

  it('actions on click footer buttons', async () => {
    const { getByTestId, getByRole } = renderComponent();

    const submitButton = getByRole('button', { name: 'ui-authorization-roles.crud.saveAndClose' });
    const cancelButton = getByRole('button', { name: 'ui-authorization-roles.crud.cancel' });

    expect(submitButton).toBeDisabled();
    expect(cancelButton).toBeInTheDocument();

    await userEvent.type(getByTestId('rolename-input'), 'New Role');
    await userEvent.click(submitButton);

    expect(mockMutateRole).toHaveBeenCalledWith({ name: 'New Role', description: '' });
  });

  it('correctly sets checked state of checkbox', async () => {
    const { getAllByRole } = renderComponent();

    expect(getAllByRole('checkbox')).toHaveLength(3);

    await userEvent.click(getAllByRole('checkbox')[0]);

    expect(getAllByRole('checkbox')[0]).toBeChecked();
  });
});
