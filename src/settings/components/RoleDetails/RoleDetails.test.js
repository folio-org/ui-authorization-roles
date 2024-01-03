import React from 'react';

import { cleanup, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import { renderWithIntl } from '@folio/stripes-erm-testing';

import { MemoryRouter } from 'react-router';
import translationsProperties from '../../../../test/helpers/translationsProperties';

import RoleDetails from './RoleDetails';
import { RoleDetailsContextProvider } from './context/RoleDetailsContext';

import useCapabilities from '../../../hooks/useCapabilities';
import useRoleCapabilities from '../../../hooks/useRoleCapabilities';
import { getKeyBasedArrayGroup } from '../../utils';

jest.mock('../../../hooks/useCapabilities');
jest.mock('../../../hooks/useRoleCapabilities');

const onClose = jest.fn();

const getRoleData = (data) => ({
  id: '2efe1d13-eff9-4b01-a2fe-512e9d5239c7',
  name: 'demo test role',
  description: 'simple description',
  metadata: {
    createdDate: '2023-03-14T12:07:17.594+00:00',
    createdBy: 'db3bcf41-767f-4a4a-803d-bd5a41ace9b1',
    modifiedDate: '2023-03-14T12:07:17.594+00:00',
  },
  capabilities:['setting-capability-id'],
  ...data,
});

const capabilities = [{
  id: '029f1117-14f5-4d8c-9f81-4786c5dc16d9',
  name: 'capability_roles.manage',
  description: 'Manage Roles',
  resource: 'Capability Roles',
  action: 'manage',
  applicationId: 'app-platform-minimal-0.0.4',
  permissions: [
    'ui-role-capabilities.manage',
    'role-capabilities.collection.post',
    'role-capabilities.collection.get',
  ],
  type: 'data',
  directParentIds: [],
  allParentIds: ['setting-capability-id'],
  metadata: {
    createdDate: '2023-07-14T15:32:15.560+00:00',
    modifiedDate: '2023-07-14T15:32:15.561+00:00',
  },
},
{
  id: 'setting-capability-id',
  name: 'capability_roles.manage',
  description: 'Manage Roles',
  resource: 'Capability Roles',
  action: 'manage',
  applicationId: 'app-platform-minimal-0.0.4',
  permissions: [
    'ui-role-capabilities.manage',
    'role-capabilities.collection.post',
    'role-capabilities.collection.get',
  ],
  type: 'settings',
  directParentIds: [],
  allParentIds: [],
  metadata: {
    createdDate: '2023-07-14T15:32:15.560+00:00',
    modifiedDate: '2023-07-14T15:32:15.561+00:00',
  },
},
{
  id: 'procedural-capability-id',
  name: 'capability_roles.manage',
  description: 'Manage Roles',
  resource: 'Capability Roles',
  action: 'manage',
  applicationId: 'app-platform-minimal-0.0.4',
  permissions: [
    'ui-role-capabilities.manage',
    'role-capabilities.collection.post',
    'role-capabilities.collection.get',
  ],
  type: 'procedural',
  directParentIds: [],
  allParentIds: [],
  metadata: {
    createdDate: '2023-07-14T15:32:15.560+00:00',
    modifiedDate: '2023-07-14T15:32:15.561+00:00',
  },
}
];

const renderComponent = () => renderWithIntl(
  <MemoryRouter>
    <RoleDetailsContextProvider
      groupedCapabilitiesByType={getKeyBasedArrayGroup(capabilities, 'type')}
    >
      <RoleDetails onClose={onClose} role={getRoleData({})} />
    </RoleDetailsContextProvider>
  </MemoryRouter>,
  translationsProperties
);

useCapabilities.mockReturnValue({ capabilitiesList: [], isSuccess: true });
useRoleCapabilities.mockReturnValue({ initialRoleCapabilitiesSelectedMap: {}, isSuccess: true });

describe('RoleDetails component', () => {
  afterEach(() => {
    cleanup();
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  describe('renders roles details pane with expanded information', () => {
    const { getByText, getByTestId } = renderComponent(getRoleData());

    it('render expanded role info by default', () => {
      expect(getByText('General Information')).toBeInTheDocument();
      expect(getByText('Assigned users')).toBeInTheDocument();
      expect(getByText('Collapse all')).toBeInTheDocument();
      expect(getByTestId('role-name')).toHaveTextContent('Name');
    });

    it('render capabilities', async () => {
      // eslint-disable-next-line no-shadow
      const { getByRole, getByTestId } = renderComponent(getRoleData());

      await userEvent.click(getByRole('button', { name: 'Capabilities' }));

      await waitFor(() => {
        expect(getByTestId('capabilities-data-type')).toBeInTheDocument();
        expect(getByTestId('capabilities-settings-type')).toBeInTheDocument();
        expect(getByTestId('capabilities-procedural-type')).toBeInTheDocument();
      });
    });
  });
});
