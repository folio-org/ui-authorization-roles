import { QueryClient, QueryClientProvider } from 'react-query';
import { act, cleanup, renderHook } from '@folio/jest-config-stripes/testing-library/react';

import { useOkapiKy } from '@folio/stripes/core';

import useRoleCapabilitySets from './useRoleCapabilitySets';

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const data = {
  'totalRecords': 3,
  'capabilitySets': [
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

const expectedInitialRoleCapabilitySetsSelectedMap = {
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
      'applicationId': 'app-platform-minimal-0.0.4',
      'id': 'data-capability-id',
      'resource': 'Capability Roles',
    },
  ],
  'procedural':  [
    {
      'actions':  {
        'manage': 'procedural-capability-id',
      },
      'applicationId': 'app-platform-minimal-0.0.4',
      'id': 'procedural-capability-id',
      'resource': 'Capability Roles',
    },
  ],
  'settings':  [
    {
      'actions':  {
        'manage': 'settings-capability-id',
      },
      'applicationId': 'app-platform-minimal-0.0.4',
      'id': 'settings-capability-id',
      'resource': 'Capability Roles',
    },
  ],
};
describe('test useRoleCapabilitySets', () => {
  beforeAll(() => {
    cleanup();
    jest.clearAllMocks();
  });
  const mockGet = jest.fn(() => ({
    json: () => Promise.resolve(data),
  }));

  beforeEach(() => {
    queryClient.clear();
    mockGet.mockClear();
    useOkapiKy.mockClear().mockReturnValue({
      get: mockGet,
    });
  });

  it('fetches role capability sets', async () => {
    const { result } = renderHook(() => useRoleCapabilitySets(1), { wrapper });
    await act(() => result.current.isSuccess);

    expect(result.current.isSuccess).toBe(true);
    expect(result.current.initialRoleCapabilitySetsSelectedMap).toBeDefined();
    expect(result.current.initialRoleCapabilitySetsSelectedMap).toStrictEqual(expectedInitialRoleCapabilitySetsSelectedMap);
    expect(result.current.capabilitySetsTotalCount).toEqual(3);
    expect(result.current.groupedRoleCapabilitySetsByType).toEqual(expectedGroupedRoleCapabilitiesByType);
  });
});
