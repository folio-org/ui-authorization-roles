import React from 'react';
import { useOkapiKy } from '@folio/stripes/core';
import { useQuery } from 'react-query';

function useRoleById(id) {
  const ky = useOkapiKy();
  const { data, isSuccess } = useQuery(
    ['role-data', id],
    () => ky.get(`roles/${id}`).json(),
    { enabled: !!id,
      refetchOnMount: false }
  );

  return { roleDetails:data, isRoleDetailsLoaded: isSuccess };
}

export default useRoleById;
