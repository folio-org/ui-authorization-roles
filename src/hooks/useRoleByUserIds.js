import { useChunkedCQLFetch, useNamespace, useOkapiKy } from '@folio/stripes/core';

function useRoleByUserIds(users) {
  // const ky = useOkapiKy();
  // const [namespace] = useNamespace({ key: 'role-data' });
  // let queryString = '';

  // if (users?.length) {
  //   users.forEach(user => {
  //     queryString += `(userId==${user}) or`;
  //   });
  // }

  // queryString = queryString.slice(0, queryString.length - 3);

  // const { data, isSuccess } = useQuery(
  //   [namespace, queryString],
  //   () => ky.get(`roles/users?limit=1000&query=${queryString}`).json(),
  //   { enabled: !!queryString }
  // );

  // const chunkedUsersReducer = (result) => {
  //   return result?[0]?.data : {};
  // };

  const chunkedUsersReducer = (list) => (
    list.reduce((acc, cur) => {
      return [...acc, ...(cur?.data?.userRoles ?? [])];
    }, []));

  // const chunkedUsersReducer = (olq) => (
  //   olq.reduce((acc, curr) => {
  //     return [...acc, ...(curr?.data ?? [])];
  //   }, [])
  // );

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
