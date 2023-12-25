import React, { useMemo } from 'react';
import { useQuery } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

const useRoleCapabilities = (roleId) => {
  const ky = useOkapiKy();

  const { data, isSuccess } = useQuery(['capabilities', roleId],
    () => ky.get(`roles/${roleId}/capabilities`).json(),
    { enabled: !!roleId,
      initialData: {
        capabilities: [], totalRecords: 0
      },
      refetchOnWindowFocus: false });

  const initialRoleCapabilitiesSelectedMap = data?.capabilities.reduce((acc, capability) => {
    acc[capability.id] = true;
    return acc;
  }, {}) || {};

  const memoized = useMemo(() => {
    return initialRoleCapabilitiesSelectedMap;
  }, [initialRoleCapabilitiesSelectedMap]);

  return { initialRoleCapabilitiesSelectedMap: memoized, isSuccess, capabilitiesTotalCount: data?.totalRecords || 0 };
};

export default useRoleCapabilities;
