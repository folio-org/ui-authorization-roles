import React from 'react';
import { useChunkedCQLFetch, useNamespace, useOkapiKy } from '@folio/stripes/core';
import { useQuery } from 'react-query';

/**
 * useUsersByRoleId
 * Given a role ID, retrieve assigned users. Ugh, client-side join, 🤢.
 * @param {string} id role ID
 * @returns [ { id, personal: { firstName, lastName } }, ... ] Array of user objects
 */
function useUsersByRoleId(id) {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'user-role-data' });

  // retrieve users assigned to the role to get their IDs...
  const { data, isSuccess } = useQuery(
    [namespace, id],
    () => ky.get(`roles/users?query=roleId==${id}`).json(),
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
    reduceFunction: (list) => (
      list.reduce((acc, cur) => {
        return [...acc, ...(cur?.data?.users ?? [])];
      }, [])
    ),
  });

  return {
    users,
    isLoading,
  };
}

export default useUsersByRoleId;
