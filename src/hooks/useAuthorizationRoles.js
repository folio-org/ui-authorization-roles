import { useQuery } from 'react-query';

import { useOkapiKy, useNamespace } from '@folio/stripes/core';

import { ROLES_ENDPOINT } from '../constants/endpoints';

const useAuthorizationRoles = ({ searchTerm = '', options }) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'ui-authorization-roles' });

  const { data, isLoading, refetch } = useQuery(
    namespace,
    () => ky.get(ROLES_ENDPOINT(searchTerm)).json(),
    { enabled: true,
      ...options }
  );

  return {
    roles: data?.roles || [],
    isLoading,
    refetch,
  };
};

export default useAuthorizationRoles;
