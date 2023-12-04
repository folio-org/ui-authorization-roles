import { useQuery } from 'react-query';

import { useNamespace, useOkapiKy } from '@folio/stripes/core';

import { ROLES_ENDPOINT } from '../constants/endpoints';

const useAuthorizationRoles = ({ searchTerm, options }) => {
  const ky = useOkapiKy();

  const [nameSpace] = useNamespace({ key: 'ui-authorization-roles' });

  const { data, isLoading, refetch } = useQuery(
    [nameSpace],
    () => ky.get(ROLES_ENDPOINT(searchTerm)).json(),
    { enabled: true, ...options }
  );

  return {
    roles: data?.roles || [],
    isLoading,
    refetch,
  };
};

export default useAuthorizationRoles;
