import React from 'react';
import { useChunkedCQLFetch, useNamespace, useOkapiKy } from '@folio/stripes/core';
import { useQuery } from 'react-query';

export const USERS_BY_ROLE_ID_QUERY_KEY = 'user-role-data';

/**
 * chunkedUsersReducer
 * reducer for useChunkedCQLFetch. Given input
 *   [
 *     { data: { users: [1, 2, 3] } },
 *     { data: { users: [4, 5, 6] } },
 *   ]
 * return
 *   [1, 2, 3, 4, 5, 6]
 *
 * @param {Array} list of chunks, each item shaped like { data: { users: [] }}
 * @returns Array flattened array of user data
 */
export const chunkedUsersReducer = (list) => (
  list.reduce((acc, cur) => {
    return [...acc, ...(cur?.data?.users ?? [])];
  }, []));

/**
 * useUsersByRoleId
 * Given a role ID, retrieve assigned users. Ugh, client-side join, 🤢.
 * @param {string} id role ID
 * @returns [ { id, personal: { firstName, lastName } }, ... ] Array of user objects
 */
function useUsersByRoleId(id) {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: USERS_BY_ROLE_ID_QUERY_KEY });

  // retrieve users assigned to the role to get their IDs...
  const { data, isSuccess, refetch } = useQuery(
    [namespace, id],
    () => ky.get(`roles/users?limit=1000&query=roleId==${id}`).json(),
    {
      enabled: !!id,
    }
  );

  // ... then retrieve corresponding user objects via chunked fetch
  // since the list may be long.
  const ids = isSuccess ? data.userRoles.map(i => i.userId) : [];
  const {
    isLoading,
    items: users
  } = useChunkedCQLFetch({
    endpoint: 'users',
    ids,
    queryEnabled: isSuccess,
    reduceFunction: chunkedUsersReducer,
  });

  return {
    users,
    isLoading,
    refetch
  };
}

export default useUsersByRoleId;
