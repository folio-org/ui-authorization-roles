import { QueryClient, QueryClientProvider } from 'react-query';
import { act, renderHook } from '@folio/jest-config-stripes/testing-library/react';

import { useOkapiKy } from '@folio/stripes/core';

import useAuthorizationRoles from './useAuthorizationRoles';

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const data = { roles: [{ id: '1', name: 'role-1' }, { id: '2', name: 'role-2' }, { id: '3', name: 'role-3' }] };
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

  it('fetches authorization roles', async () => {
    const { result } = renderHook(() => useAuthorizationRoles(), { wrapper });
    await act(() => !result.current.isLoading);

    expect(result.current.roles).toEqual(data.roles);
    expect(result.current.isLoading).toBe(false);

    const spy = jest.spyOn(result.current, 'onSubmitSearch');
    await act(async () => { result.current.onSubmitSearch('role'); });

    expect(spy).toHaveBeenCalled();
  });
});
