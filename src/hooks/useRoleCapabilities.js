import React, { useMemo } from 'react';
import { useQuery } from 'react-query';

import { useNamespace, useOkapiKy, useStripes } from '@folio/stripes/core';
import { getCapabilitiesGroupedByTypeAndResource } from '../settings/utils';

const useRoleCapabilities = (roleId) => {
  const ky = useOkapiKy();
  const stripes = useStripes();
  const [namespace] = useNamespace({ key: 'ui-authorization-roles:role-capabilities-list' });

  const { data, isSuccess } = useQuery([namespace, roleId],
    () => ky.get(`roles/${roleId}/capabilities?limit=${stripes.config.maxUnpagedResourceCount}`).json(),
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


  const groupedRoleCapabilitiesByType = useMemo(() => {
    return getCapabilitiesGroupedByTypeAndResource(data?.capabilities || []);
  }, [data]);

  return { initialRoleCapabilitiesSelectedMap, isSuccess, capabilitiesTotalCount: data?.totalRecords || 0, groupedRoleCapabilitiesByType: groupedRoleCapabilitiesByType || { data: [], settings: [], procedural: [] } };
};

export default useRoleCapabilities;
