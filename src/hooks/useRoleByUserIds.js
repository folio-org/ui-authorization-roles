import { useNamespace, useOkapiKy } from '@folio/stripes/core';
import { useQuery } from 'react-query';

function useRoleByUserIds(users) {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'role-data' });
  let queryString = '';

  if (users?.length) {
    users.forEach(user => {
      queryString += `(userId==${user}) or`;
    });
  }

  queryString = queryString.slice(0, queryString.length - 3);

  const { data, isSuccess } = useQuery(
    [namespace, queryString],
    () => ky.get(`roles/users?query=${queryString}`).json(),
    { enabled: !!queryString }
  );

  return { roleDetails:data, isSuccess };
}

export default useRoleByUserIds;
