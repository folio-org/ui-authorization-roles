import React from 'react';

import userEvent from '@testing-library/user-event';
import { cleanup } from '@testing-library/react';
import { renderWithIntl } from '@folio/stripes-erm-testing';
import { MemoryRouter } from 'react-router';

import translationsProperties from '../../../../test/helpers/translationsProperties';

import '@testing-library/jest-dom';

import CreateRole from './CreateRole';
import useCapabilities from '../../../hooks/useCapabilities';

import useCreateRoleMutation from '../../../hooks/useCreateRoleMutation';


jest.mock('../../../hooks/useCapabilities');
jest.mock('../../../hooks/useCreateRoleMutation', () => ({
  __esModule: true,
  default: jest.fn()
}));
function mockReactRouterDomFn() {
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

jest.mock('react-router-dom', () => mockReactRouterDomFn());

jest.mock('@folio/stripes/components', () => {
  const original = jest.requireActual('@folio/stripes/components');
  return {
    ...original,
    Layer: jest.fn(({ children }) => <div data-testid="mock-layer">{children}</div>)
  };
});

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
      },
    ] },
    isSuccess: true });
  });

  it('renders TextField and Button components', async () => {
    const { getByTestId } = renderWithIntl(
      <MemoryRouter>
        <CreateRole />
      </MemoryRouter>,
      translationsProperties
    );

    expect(getByTestId('create-role-form')).toBeInTheDocument();
  });

  it('changes name, description input values', async () => {
    const { getByTestId } = renderWithIntl(
      <MemoryRouter>
        <CreateRole />
      </MemoryRouter>,
      translationsProperties
    );

    const descriptionInput = getByTestId('description-input');
    const nameInput = getByTestId('rolename-input');

    await userEvent.type(nameInput, 'New Role');
    await userEvent.type(descriptionInput, 'Description');

    expect(nameInput).toHaveValue('New Role');
    expect(descriptionInput).toHaveValue('Description');
  });

  it('actions on click footer buttons', async () => {
    const { getByTestId, getByRole } = renderWithIntl(
      <MemoryRouter>
        <CreateRole />
      </MemoryRouter>,
      translationsProperties
    );

    const submitButton = getByRole('button', { name: 'Save and close' });
    const cancelButton = getByRole('button', { name: 'Cancel' });

    expect(submitButton).toBeDisabled();
    expect(cancelButton).toBeInTheDocument();

    await userEvent.type(getByTestId('rolename-input'), 'New Role');
    await userEvent.click(submitButton);

    expect(mockMutateRole).toHaveBeenCalledWith({ name: 'New Role', description: '' });
  });

  it('correctly sets checked state of checkbox', async () => {
    const { getByRole, getAllByRole } = renderWithIntl(
      <MemoryRouter>
        <CreateRole />
      </MemoryRouter>,
      translationsProperties
    );

    expect(getAllByRole('checkbox')).toHaveLength(1);

    await userEvent.click(getByRole('checkbox'));

    expect(getByRole('checkbox')).toBeChecked();
  });
});
