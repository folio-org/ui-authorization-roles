import React from 'react';
import { useNamespace, useOkapiKy } from '@folio/stripes/core';
import { useQuery } from 'react-query';

function useRoleById(id) {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'ui-authorization-roles:role-data' });
  const { data, isSuccess } = useQuery(
    [namespace, id],
    () => ky.get(`roles/${id}`).json(),
    { enabled: !!id }
  );

  return { roleDetails:data, isRoleDetailsLoaded: isSuccess };
}

export default useRoleById;
