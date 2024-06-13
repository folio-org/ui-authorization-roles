import { QueryClient, QueryClientProvider } from 'react-query';
import { act, cleanup, renderHook } from '@folio/jest-config-stripes/testing-library/react';

import { useOkapiKy, useStripes } from '@folio/stripes/core';

import useRoleCapabilities from './useRoleCapabilities';

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useOkapiKy: jest.fn(),
  useStripes: jest.fn(),
}));

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const data = {
  'totalRecords': 2,
  'capabilities': [
    {
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
        createdDate: '2023-07-14T15:32:15.56000:00',
        modifiedDate: '2023-07-14T15:32:15.561+00:00',
      },
    },
    {
      id: 'settings-capability-id',
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
  ]
};

const expectedInitialRoleCapabilitiesSelectedMap = {
  'data-capability-id': true,
  'settings-capability-id': true,
  'procedural-capability-id': true
};

const expectedGroupedRoleCapabilitiesByType = {
  'data':  [
    {
      'actions':  {
        'manage': 'data-capability-id',
      },
      'applicationId': 'app-platform-minimal',
      'id': 'data-capability-id',
      'resource': 'Capability Roles',
    },
  ],
  'procedural':  [
    {
      'actions':  {
        'manage': 'procedural-capability-id',
      },
      'applicationId': 'app-platform-minimal',
      'id': 'procedural-capability-id',
      'resource': 'Capability Roles',
    },
  ],
  'settings':  [
    {
      'actions':  {
        'manage': 'settings-capability-id',
      },
      'applicationId': 'app-platform-minimal',
      'id': 'settings-capability-id',
      'resource': 'Capability Roles',
    },
  ],
};
describe('useRoleCapabilities', () => {
  const mockGet = jest.fn(() => ({
    json: () => Promise.resolve(data),
  }));

  beforeEach(() => {
    queryClient.clear();
    mockGet.mockClear();
    useOkapiKy.mockClear().mockReturnValue({
      get: mockGet,
    });
    useStripes.mockClear().mockReturnValue({
      discovery: {
        applications: {
          'app-platform-minimal-0.0.4': 'app-platform-minimal',
        }
      }
    });
  });

  afterAll(() => {
    jest.clearAllMocks();
    cleanup();
  });

  it('fetches role capabilities', async () => {
    const { result } = renderHook(() => useRoleCapabilities(1), { wrapper });
    await act(() => result.current.isSuccess);

    expect(result.current.isSuccess).toBe(true);
    expect(result.current.initialRoleCapabilitiesSelectedMap).toEqual(expectedInitialRoleCapabilitiesSelectedMap);
    expect(result.current.capabilitiesTotalCount).toEqual(2);
    expect(result.current.groupedRoleCapabilitiesByType).toEqual(expectedGroupedRoleCapabilitiesByType);
    expect(result.current.capabilitiesAppIds).toEqual({ 'app-platform-minimal-0.0.4': true });
  });
});
