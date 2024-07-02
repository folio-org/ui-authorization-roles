import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import { act, cleanup, render, waitFor } from '@folio/jest-config-stripes/testing-library/react';
import '@folio/jest-config-stripes/testing-library/jest-dom';

import CreateRole from './CreateRole';

import renderWithRouter from '../../../../test/jest/helpers/renderWithRouter';
import {
  useApplicationCapabilities,
  useApplicationCapabilitySets,
  useCreateRoleMutation
} from '../../../hooks';

jest.mock('../../../hooks', () => ({
  ...jest.requireActual('../../../hooks'),
  useApplicationCapabilities: jest.fn(),
  useApplicationCapabilitySets: jest.fn(),
  useCreateRoleMutation: jest.fn(),
  useCapabilities: jest.fn(),
}));

jest.mock('@folio/stripes/components', () => {
  const original = jest.requireActual('@folio/stripes/components');
  return {
    ...original,
    Layer: jest.fn(({ children }) => <div data-testid="mock-layer">{children}</div>)
  };
});

const mockSetSelectedCapabilitiesMap = jest.fn();

const renderComponent = () => render(renderWithRouter(<CreateRole path="/settings/auz-rolez" />));

describe('CreateRole component', () => {
  const mockMutateRole = jest.fn();

  afterEach(() => {
    cleanup();
  });

  afterAll(() => {
    cleanup();
    jest.clearAllMocks();
  });

  beforeEach(() => {
    useCreateRoleMutation.mockReturnValue({ mutateRole:mockMutateRole, isLoading: false });
    useApplicationCapabilities.mockReturnValue({ capabilities: { data:[{ id:'6e59c367-888a-4561-a3f3-3ca677de437f',
      applicationId:'app-platform-complete-0.0.5',
      resource:'Erm Agreements Collection',
      actions:{ view:'6e59c367-888a-4561-a3f3-3ca677de437f' } },
    ],
    procedural:[],
    settings:[{ id:'DDD-888a-4561-a3f3-3ca677de437f',
      applicationId:'app-platform-complete-0.0.5',
      resource:'Erm Agreements Collection',
      actions:{ view:'DDD-888a-4561-a3f3-3ca677de437f' } }] },
    roleCapabilitiesListIds: ['5c5198f9-de27-4349-9537-dc0b2b41c8c3'],
    selectedCapabilitiesMap: { },
    setSelectedCapabilitiesMap:mockSetSelectedCapabilitiesMap,
    isLoading: false });

    useApplicationCapabilitySets.mockReturnValue({ capabilitySets: { data: [{ id:'d2e91897-c10d-46f6-92df-dad77c1e8862',
      applicationId:'app-platform-complete-0.0.5',
      resource:'Erm Agreements Collection',
      actions:{ view:'d2e91897-c10d-46f6-92df-dad77c1e8862' },
      capabilities:['6de59c367-888a-4561-a3f3-3ca677de437f'] }
    ] },
    capabilitySetsList:[{
      id: 'd2e91897-c10d-46f6-92df-dad77c1e8862',
      name: 'foo_item.create',
      description: 'Sample: Create foo item',
      resource: 'Erm Agreements Collection',
      action: 'view',
      type: 'data',
      applicationId: 'app-platform-complete-0.0.5',
      capabilities: ['6e59c367-888a-4561-a3f3-3ca677de437f'],
    }],
    roleCapabilitySetsListIds: [],
    selectedCapabilitySetsMap: {},
    setSelectedCapabilitySetsMap: jest.fn(),
    isLoading: false });
  });

  it('renders TextField and Button components', async () => {
    const { getByTestId } = renderComponent();

    expect(getByTestId('create-role-form')).toBeInTheDocument();
  });

  it('changes name, description input values', async () => {
    const { getByTestId } = renderComponent();

    const descriptionInput = getByTestId('description-input');
    const nameInput = getByTestId('rolename-input');

    await act(async () => {
      await userEvent.type(nameInput, 'New Role');
      await userEvent.type(descriptionInput, 'Description');
    });

    expect(nameInput).toHaveValue('New Role');
    expect(descriptionInput).toHaveValue('Description');
  });

  it('actions on click footer buttons', async () => {
    const { getByTestId, getByRole } = renderComponent();

    const submitButton = getByRole('button', { name: 'stripes-components.saveAndClose' });
    const cancelButton = getByRole('button', { name: 'ui-authorization-roles.crud.cancel' });

    expect(submitButton).toBeDisabled();
    expect(cancelButton).toBeInTheDocument();

    await act(async () => {
      await userEvent.type(getByTestId('rolename-input'), 'New Role');
      await userEvent.click(submitButton);
    });

    expect(mockMutateRole).toHaveBeenCalledWith({ name: 'New Role', description: '' });
  });

  it('should call capability checkbox handler actions on click', async () => {
    const { getAllByRole } = renderComponent();

    await waitFor(async () => {
      expect(getAllByRole('checkbox')).toHaveLength(3);
      await userEvent.click(getAllByRole('checkbox')[2]);
    });

    expect(mockSetSelectedCapabilitiesMap).toHaveBeenCalledWith({ 'DDD-888a-4561-a3f3-3ca677de437f': true });
  });

  it('should call capability set checkbox handler actions on click', async () => {
    const { getAllByRole } = renderComponent();
    const indexOfCapabilitySet = 0;

    await waitFor(async () => {
      await userEvent.click(getAllByRole('checkbox')[indexOfCapabilitySet]);
    });
  });
});
