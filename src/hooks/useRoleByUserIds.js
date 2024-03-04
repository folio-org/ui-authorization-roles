import { useChunkedCQLFetch } from '@folio/stripes/core';

function useRoleByUserIds(users) {

  const chunkedUsersReducer = (list) => (
    list.reduce((acc, cur) => {
      return [...acc, ...(cur?.data?.userRoles ?? [])];
    }, []));

  const {
    isLoading,
    items: roleDetails
  } = useChunkedCQLFetch({
    endpoint: 'roles/users',
    ids: users,
    idName: 'userId',
    reduceFunction: chunkedUsersReducer
  });

  return { roleDetails, isLoading };
}

export default useRoleByUserIds;
