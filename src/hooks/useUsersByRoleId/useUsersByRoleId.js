import { useQuery } from 'react-query';

import {
  useChunkedCQLFetch,
  useNamespace,
  useOkapiKy,
  useStripes,
} from '@folio/stripes/core';

import { chunkedUsersReducer } from '../useUserRolesByUserIds';

export const USERS_BY_ROLE_ID_QUERY_KEY = 'user-role-data';

/**
 * useUsersByRoleId
 * Given a role ID, retrieve assigned users. Ugh, client-side join, 🤢.
 * @param {string} id role ID
 * @returns [ { id, personal: { firstName, lastName } }, ... ] Array of user objects
 */
function useUsersByRoleId(id) {
  const stripes = useStripes();
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: USERS_BY_ROLE_ID_QUERY_KEY });

  // retrieve users assigned to the role to get their IDs...
  const { data, isSuccess, refetch } = useQuery(
    [namespace, id],
    () => ky.get(`roles/users?limit=${stripes.config.maxUnpagedResourceCount}&query=roleId==${id}`).json(),
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
