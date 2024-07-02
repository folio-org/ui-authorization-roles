import { QueryClient, QueryClientProvider } from 'react-query';
import { act, renderHook } from '@folio/jest-config-stripes/testing-library/react';

import {
  useChunkedCQLFetch,
  useOkapiKy,
} from '@folio/stripes/core';

import useUsersByRoleId, { chunkedUsersReducer } from './useUsersByRoleId';

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const roleData = {
  'userRoles': [
    {
      'userId': 'a1',
      'roleId': 'roleId',
    },
    {
      'userId': 'b2',
      'roleId': 'roleId',
    }
  ],
  'totalRecords': 2
};

const userData = {
  'users': [
    {
      'username': 'aapple',
      'id': 'a1',
      'active': true,
      'type': 'staff',
      'personal': {
        'lastName': 'Andrea',
        'firstName': 'Apple',
        'middleName': 'A'
      },
    },
    {
      'username': 'bblick',
      'id': 'b2',
      'active': true,
      'type': 'staff',
      'personal': {
        'lastName': 'Bethany',
        'firstName': 'Blick',
        'middleName': 'B'
      }
    }
  ],
  'totalRecords': 2,
  'resultInfo': {
    'totalRecords': 2
  }
};

describe('useUsersByRoleId', () => {
  const mockUsersByRoleGet = jest.fn(() => ({
    json: () => Promise.resolve(roleData),
  }));
  const mockUsersGet = jest.fn(() => ({
    items: userData,
    isLoading: false,
  }));

  beforeEach(() => {
    queryClient.clear();
    mockUsersByRoleGet.mockClear();
    mockUsersGet.mockClear();
    useOkapiKy.mockClear().mockReturnValue({
      get: mockUsersByRoleGet,
    });
    useChunkedCQLFetch.mockClear().mockReturnValue({
      items: userData,
      isLoading: false,
    });
  });

  it('fetches users assigned to a role', async () => {
    const { result } = renderHook(() => useUsersByRoleId('roleId'), { wrapper });
    await act(() => !result.current.isFetching);

    expect(result.current.isLoading).toBe(false);
    expect(result.current.users).toEqual(userData);
  });
});

describe('chunkedUsersReducer', () => {
  it('assembles chunks', () => {
    const list = [
      { data: { users: [1, 2, 3] } },
      { data: { users: [4, 5, 6] } },
    ];

    const result = chunkedUsersReducer(list);
    expect(result.length).toBe(6);
  });
});
