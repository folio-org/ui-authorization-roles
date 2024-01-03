import { useQuery } from 'react-query';

import { useOkapiKy, useNamespace, useStripes } from '@folio/stripes/core';

import { useEffect, useState } from 'react';
import { ROLES_ENDPOINT } from '../constants/endpoints';

const useAuthorizationRoles = () => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'ui-authorization-roles' });
  const stripes = useStripes();
  const [roles, setRoles] = useState([]);

  const { data, isLoading, refetch, isSuccess } = useQuery(
    namespace,
    () => ky.get(ROLES_ENDPOINT(stripes.config.maxUnpagedResourceCount)).json()
  );

  const filterRoles = (searchTerm) => {
    setRoles(data.roles.filter(role => role.name.toLowerCase().includes(searchTerm.toLowerCase())));
  };

  useEffect(() => {
    if (isSuccess) {
      setRoles(data?.roles || []);
    }
  }, [data, isSuccess]);

  return {
    roles,
    isLoading,
    filterRoles,
    refetch,
  };
};

export default useAuthorizationRoles;
