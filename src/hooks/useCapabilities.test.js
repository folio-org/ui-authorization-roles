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

const data = { capabilities: [{ id: '1', type: 'settings' }, { id: '2', type: 'procedural' }, { id: '3', type: 'data' }] };

const expectedGroupedCapabilitiesByType = {
  settings: [{ id: '1', type: 'settings' }],
  procedural: [{ id: '2', type: 'procedural' }],
  data: [{ id: '3', type: 'data' }],
};
describe('useRoleById', () => {
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
    expect(result.current.groupedCapabilitiesByType).toEqual(expectedGroupedCapabilitiesByType);
    expect(result.current.capabilitiesList).toEqual(data.capabilities);
  });
});
