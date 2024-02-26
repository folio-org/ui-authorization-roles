import React from 'react';

import userEvent from '@testing-library/user-event';
import { cleanup } from '@testing-library/react';

import '@testing-library/jest-dom';
import { render } from '@folio/jest-config-stripes/testing-library/react';

import EditRole from './EditRole';
import useCapabilities from '../../../hooks/useCapabilities';
import useRoleCapabilities from '../../../hooks/useRoleCapabilities';
import useEditRoleMutation from '../../../hooks/useEditRoleMutation';
import useRoleCapabilitySets from '../../../hooks/useRoleCapabilitySets';
import useCapabilitySets from '../../../hooks/useCapabilitySets';
import useRoleById from '../../../hooks/useRoleById';
import renderWithRouter from '../../../../test/jest/helpers/renderWithRouter';
import useApplicationCapabilities from '../../../hooks/useApplicationCapabilities';

const mockPutRequest = jest.fn().mockReturnValue({ ok:true });
const mockPostRequest = jest.fn().mockReturnValue({ ok:true });

const mockOnInitialLoad = jest.fn();
const mockSetSelectedCapabilitiesMap = jest.fn();

jest.mock('../../../hooks/useCapabilities');
jest.mock('../../../hooks/useRoleCapabilities');
jest.mock('../../../hooks/useRoleById');
jest.mock('../../../hooks/useRoleCapabilitySets');
jest.mock('../../../hooks/useCapabilitySets');
jest.mock('../../../hooks/useApplicationCapabilities');

jest.mock('../../../hooks/useEditRoleMutation', () => ({
  __esModule: true,
  default: jest.fn()
}));

const mockMutateFn = jest.fn();
jest.mock('react-query', () => ({
  ...jest.requireActual('react-query'),
  useMutation: () => ({ mutate: mockMutateFn, isLoading: false }),
}));

const mockPluggableOnClose = jest.fn();

const mockSubmitPluginImplementation = jest.fn().mockImplementation((onSave, checkedAppIdsMap) => {
  return () => onSave(checkedAppIdsMap, mockPluggableOnClose);
});

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useOkapiKy: () => ({
    put: mockPutRequest,
    post: mockPostRequest
  }),
  Pluggable: ({ checkedAppIdsMap, onSave }) => {
    return <div data-testid="pluggable-select-application">
      <button data-testid="pluggable-submit-button" type="button" onClick={mockSubmitPluginImplementation(onSave, checkedAppIdsMap)}>Select application</button>
    </div>;
  }
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

  beforeAll(() => {
    useEditRoleMutation.mockReturnValue({ mutateRole: mockMutateRole, isLoading: false });
    useCapabilities.mockReturnValue({ capabilitiesList: [
      {
        id: '8d2da27c-1d56-48b6-9534218d-2bfae6d79dc8',
        applicationId: 'Inventory-2.0',
        name: 'foo_item.delete',
        description: 'Settings: Delete foo item',
        resource: 'Settings source',
        action: 'edit',
        type: 'settings',
      }
    ],
    isSuccess: true });
    useRoleCapabilities.mockReturnValue({ initialRoleCapabilitiesSelectedMap: { '6e59c367-888a-4561-a3f3-3ca677de437f': true }, isSuccess: true });
    useRoleById.mockReturnValue({ roleDetails: { id: '1', name: 'Admin', description: 'Description' }, isSuccess: true });
    useRoleCapabilitySets.mockReturnValue({ initialRoleCapabilitySetsSelectedMap: {}, isSuccess: true });
    useCapabilitySets.mockReturnValue({ data: {
      capabilitySets: [
        {
          'id': 'd2e91897-c10d-46f6-92df-dad77c1e8862',
          'description': 'Sample: Create foo item',
          'resource': 'Erm Agreements Collection',
          'action': 'create',
          'type': 'data',
          'applicationId': 'app-platform-complete-0.0.5',
          'capabilities': [
            '6e59c367-888a-4561-a3f3-3ca677de437f',
            'db1ceca9-2bb1-4212-8203-755cd5bc5bf9',
            '98af4c92-1df2-4916-96b4-886bec72ad29'
          ]
        }
      ]
    },
    isSuccess: true });
    useApplicationCapabilities.mockReturnValue({ capabilities: { data:[{ id:'6e59c367-888a-4561-a3f3-3ca677de437f',
      applicationId:'app-platform-complete-0.0.5',
      resource:'Erm Agreements Collection',
      actions:{ 'view':'6e59c367-888a-4561-a3f3-3ca677de437f' } },
    { id:'db1ceca9-2bb1-4212-8203-755cd5bc5bf9',
      applicationId:'app-platform-complete-0.0.5',
      resource:'Erm Agreements Item',
      'actions':{ 'view':'db1ceca9-2bb1-4212-8203-755cd5bc5bf9' } }],
    procedural:[{ id:'98af4c92-1df2-4916-96b4-886bec72ad29',
      applicationId:'app-platform-complete-0.0.5',
      resource:'Erm Agreements',
      actions:{ execute:'98af4c92-1df2-4916-96b4-886bec72ad29' } }],
    settings:[] },
    checkedAppIdsMap: { 'app-platform-complete-0.0.5': true },
    roleCapabilitiesListIds: ['5c5198f9-de27-4349-9537-dc0b2b41c8c3'],
    capabilitySets: { data: [{ id:'d2e91897-c10d-46f6-92df-dad77c1e8862',
      applicationId:'app-platform-complete-0.0.5',
      resource:'Erm Agreements Collection',
      actions:{ view:'d2e91897-c10d-46f6-92df-dad77c1e8862' },
      capabilities:['6e59c367-888a-4561-a3f3-3ca677de437f'] }
    ] },
    selectedCapabilitiesMap: { '5c5198f9-de27-4349-9537-dc0b2b41c8c3':true },
    roleCapabilitySetsListIds: [],
    disabledCapabilities: {},
    selectedCapabilitySetsMap: {},
    onSubmitSelectApplications: jest.fn(),
    setSelectedCapabilitiesMap:mockSetSelectedCapabilitiesMap,
    onInitialLoad: mockOnInitialLoad,
    setSelectedCapabilitySetsMap: jest.fn(),
    setDisabledCapabilities: jest.fn() });
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

  it('should set role name and description when selectedRole is truthy', () => {
    const { getByTestId } = render(renderWithRouter(
      <EditRole roleId="1" />
    ));

    const roleNameInput = getByTestId('rolename-input');
    const descriptionInput = getByTestId('description-input');

    expect(roleNameInput.value).toBe('Admin');
    expect(descriptionInput.value).toBe('Description');
    expect(getByTestId('pluggable-select-application')).toBeInTheDocument();
  });

  it('should call actions on select capabilities', async () => {
    const { getAllByRole } = render(renderWithRouter(
      <EditRole roleId="1" />
    ));

    const capabilitiesCheckboxLength = 3;
    const capabilitySetsCheckboxLength = 1;

    expect(getAllByRole('checkbox')).toHaveLength(capabilitiesCheckboxLength + capabilitySetsCheckboxLength);

    await userEvent.click(getAllByRole('checkbox')[0]);
    expect(mockSetSelectedCapabilitiesMap).toHaveBeenCalledWith({ '6e59c367-888a-4561-a3f3-3ca677de437f': true });
  });
});
