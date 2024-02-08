import React from 'react';

import { cleanup, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import { render } from '@folio/jest-config-stripes/testing-library/react';
import RoleDetails from './RoleDetails';

import useCapabilities from '../../../hooks/useCapabilities';
import useRoleCapabilities from '../../../hooks/useRoleCapabilities';
import useRoleCapabilitySets from '../../../hooks/useRoleCapabilitySets';
import useRoleById from '../../../hooks/useRoleById';
import { getCapabilitiesGroupedByTypeAndResource } from '../../utils';
import renderWithRouter from '../../../../test/jest/helpers/renderWithRouter';

jest.mock('../../../hooks/useCapabilities');
jest.mock('../../../hooks/useRoleCapabilities');
jest.mock('../../../hooks/useRoleById');
jest.mock('../../../hooks/useRoleCapabilitySets');

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
  id: 'data-capability-id',
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
  metadata: {
    createdDate: '2023-07-14T15:32:15.560+00:00',
    modifiedDate: '2023-07-14T15:32:15.561+00:00',
  },
}
];

const renderComponent = () => render(
  renderWithRouter(
    <RoleDetails onClose={onClose} roleId="1" />
  )
);

useCapabilities.mockReturnValue({ capabilitiesList: [], isSuccess: true });
useRoleCapabilities.mockReturnValue({ initialRoleCapabilitiesSelectedMap: { 'data-capability-id': true }, isSuccess: true, groupedRoleCapabilitiesByType: getCapabilitiesGroupedByTypeAndResource(capabilities) });
useRoleById.mockReturnValue({ roleDetails: getRoleData(), isRoleDetailsLoaded: true });
useRoleCapabilitySets.mockReturnValue({ isSuccess: true, initialRoleCapabilitySetsSelectedMap: {}, groupedRoleCapabilitySetsByType: {} });

describe('RoleDetails component', () => {
  afterEach(() => {
    cleanup();
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  describe('renders roles details pane with expanded information', () => {
    const { getByText, getByTestId } = renderComponent();

    it('render expanded role info by default', () => {
      expect(getByText('ui-authorization-roles.generalInformation')).toBeInTheDocument();
      expect(getByText('ui-authorization-roles.assignedUsers')).toBeInTheDocument();
      expect(getByTestId('role-name')).toHaveTextContent('demo test role');
    });

    it('render capabilities', async () => {
      // eslint-disable-next-line no-shadow
      const { getByRole, getByTestId } = renderComponent();

      await userEvent.click(getByRole('button', { name: 'ui-authorization-roles.details.capabilities' }));

      await waitFor(() => {
        expect(getByTestId('capabilities-data-type')).toBeInTheDocument();
        expect(getByTestId('capabilities-settings-type')).toBeInTheDocument();
        expect(getByTestId('capabilities-procedural-type')).toBeInTheDocument();
      });
    });
  });
});
