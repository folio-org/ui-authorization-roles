import { useQuery } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import { ROLES_ENDPOINT } from '../constants/endpoints';

const useAuthorizationRoles = ({ searchTerm = '', options }) => {
  const ky = useOkapiKy();

  const { data, isLoading, refetch } = useQuery(
    'ui-authorization-roles',
    () => ky.get(ROLES_ENDPOINT(searchTerm)).json(),
    { enabled: true,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      ...options }
  );

  return {
    roles: data?.roles || [],
    isLoading,
    refetch,
  };
};

export default useAuthorizationRoles;
