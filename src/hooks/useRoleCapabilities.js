import React, { useMemo } from 'react';
import { useQuery } from 'react-query';

import { useNamespace, useOkapiKy } from '@folio/stripes/core';

import { CAPABILITES_LIMIT } from './constants';
import { getCapabilitiesGroupedByTypeAndResource } from '../settings/utils';

const useRoleCapabilities = (roleId) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'role-capabilities-list' });

  const { data, isSuccess } = useQuery([namespace, roleId],
    () => ky.get(`roles/${roleId}/capabilities?limit=${CAPABILITES_LIMIT}&query=cql.allRecords=1 sortby resource`).json(),
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

  return { initialRoleCapabilitiesSelectedMap, isSuccess, capabilitiesTotalCount: data?.totalRecords || 0, groupedRoleCapabilitiesByType };
};

export default useRoleCapabilities;
