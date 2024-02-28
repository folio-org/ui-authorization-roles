import React, { useMemo } from 'react';
import { useQuery } from 'react-query';

import { useNamespace, useOkapiKy } from '@folio/stripes/core';
import { getCapabilitiesGroupedByTypeAndResource } from '../settings/utils';
import { CAPABILITES_LIMIT } from './constants';

const useRoleCapabilitySets = (roleId) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'role-capability-sets' });

  const { data, isSuccess } = useQuery([namespace, roleId],
    () => ky.get(`roles/${roleId}/capability-sets?limit=${CAPABILITES_LIMIT}`).json(),
    { enabled: !!roleId });

  const initialRoleCapabilitySetsSelectedMap = useMemo(() => {
    return data?.capabilitySets.reduce((acc, capability) => {
      acc[capability.id] = true;
      return acc;
    }, {}) || {};
  }, [data]);


  const groupedRoleCapabilitySetsByType = useMemo(() => {
    return getCapabilitiesGroupedByTypeAndResource(data?.capabilitySets || []);
  }, [data]);

  const capabilitySetsCapabilities = data?.capabilitySets.flatMap(capSet => capSet.capabilities).reduce((obj, item) => {
    obj[item] = true;
    return obj;
  }, {});

  return { initialRoleCapabilitySetsSelectedMap,
    isSuccess,
    capabilitySetsTotalCount: data?.totalRecords || 0,
    groupedRoleCapabilitySetsByType,
    capabilitySetsCapabilities };
};

export default useRoleCapabilitySets;

