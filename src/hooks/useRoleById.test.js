import { QueryClient, QueryClientProvider } from 'react-query';
import { act, renderHook } from '@folio/jest-config-stripes/testing-library/react';

// import '../../test/jest/__mock__';

import { useOkapiKy } from '@folio/stripes/core';

import useRoleById from './useRoleById';

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const data = { id: 'role-1', name: 'role-1' };

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

  it('fetches role by id', async () => {
    const { result } = renderHook(() => useRoleById(23), { wrapper });
    await act(() => !result.current.isFetching);

    expect(result.current.isRoleDetailsLoaded).toBe(true);
    expect(result.current.roleDetails).toEqual(data);
  });
});
