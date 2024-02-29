import { QueryClient, QueryClientProvider } from 'react-query';
import { act, renderHook } from '@folio/jest-config-stripes/testing-library/react';

// import '../../test/jest/__mock__';

import { useOkapiKy } from '@folio/stripes/core';

import useCapabilities from './useCapabilities';

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const data = { capabilities: [{ id: '1', type: 'settings', action: 'manage', resource: 'Capability Roles', applicationId: 'application-01' },
  { id: '2', type: 'settings', action: 'view', resource: 'Capability Roles', applicationId: 'application-01' },
  { id: '3', type: 'settings', action: 'edit', resource: 'Capability Roles', applicationId: 'application-01' },
  { id: '11', type: 'data', action: 'create', resource: 'Capability data', applicationId: 'application-01' },
  { id: '22', type: 'data', action: 'delete', resource: 'Capability data', applicationId: 'application-01' },
  { id: '33', type: 'data', action: 'manage', resource: 'Capability data', applicationId: 'application-01' },
  { id: '111', type: 'procedural', action: 'execute', resource: 'Capability procedural', applicationId: 'application-01' },
] };

describe('useCapabilities', () => {
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

  it('fetches capabilities', async () => {
    const { result } = renderHook(() => useCapabilities(), { wrapper });
    await act(() => result.current.isSuccess);

    expect(result.current.isSuccess).toBe(true);
    expect(result.current.capabilitiesList).toEqual(data.capabilities);
  });
});
