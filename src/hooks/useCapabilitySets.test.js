import { QueryClient, QueryClientProvider } from 'react-query';
import { act, renderHook } from '@folio/jest-config-stripes/testing-library/react';

import { useOkapiKy } from '@folio/stripes/core';

import useCapabilitySets from './useCapabilitySets';

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);


const data = { capabilitySets: [{ id: '1', type: 'settings', action: 'manage', resource: 'Capability Roles', applicationId: 'application-01', capabilities: '222' },
] };

describe('useCapabilitySet', () => {
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

  it('fetches capabilitySets', async () => {
    const { result } = renderHook(() => useCapabilitySets(), { wrapper });
    await act(() => result.current.isSuccess);

    expect(result.current.data).toStrictEqual(data);
    expect(result.current.isSuccess).toBe(true);
  });
});
