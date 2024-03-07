import { QueryClient, QueryClientProvider } from 'react-query';
import { act, renderHook } from '@folio/jest-config-stripes/testing-library/react';

import {
  useChunkedCQLFetch,
} from '@folio/stripes/core';

import useUserRolesByUserIds, { chunkedUsersReducer } from './useUserRolesByUserIds';

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const userRolesData = {
  'userRoles': [
    {
      'userId': 'u1',
      'roleId': 'r1'
    },
    {
      'userId': 'u1',
      'roleId': 'r2'
    },
    {
      'userId': 'u2',
      'roleId': 'r1'
    },
    {
      'userId': 'u1',
      'roleId': 'r3'
    },
  ]
};

describe('useUserRolesByUserIds', () => {
  beforeEach(() => {
    useChunkedCQLFetch.mockClear().mockReturnValue({
      items: userRolesData,
      isLoading: false,
    });
  });

  it('fetches users assigned to a role', async () => {
    const { result } = renderHook(() => useUserRolesByUserIds('roleId'), { wrapper });
    await act(() => !result.current.isFetching);

    expect(result.current.isLoading).toBe(false);
    expect(result.current.userRolesResponse).toEqual(userRolesData);
  });
});

describe('chunkedUsersReducer', () => {
  it('assembles chunks', () => {
    const list = [
      { data: { userRoles: [{ userId: 'u1', roleId: 'r1' }, { userId: 'u1', roleId: 'r2' }] } },
      { data: { userRoles: [{ userId: 'u2', roleId: 'r1' }, { userId: 'u1', roleId: 'r3' }] } },
    ];

    const result = chunkedUsersReducer(list);
    expect(result.length).toBe(4);
  });
});
