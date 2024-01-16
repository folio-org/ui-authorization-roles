import React, { useMemo } from 'react';
import { useQuery } from 'react-query';

import { useNamespace, useOkapiKy } from '@folio/stripes/core';

const useRoleCapabilities = (roleId) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'ui-authorization-roles:role-capabilities-list' });

  const { data, isSuccess } = useQuery([namespace, roleId],
    () => ky.get(`roles/${roleId}/capabilities`).json(),
    { enabled: !!roleId,
      placeholderData: {
        capabilities: [], totalRecords: 0
      } });

  const initialRoleCapabilitiesSelectedMap = useMemo(() => {
    return data?.capabilities.reduce((acc, capability) => {
      acc[capability.id] = true;
      return acc;
    }, {}) || {};
  }, [data]);

  return { initialRoleCapabilitiesSelectedMap, isSuccess, capabilitiesTotalCount: data?.totalRecords || 0 };
};

export default useRoleCapabilities;
