import React, { useMemo } from 'react';
import { useQuery } from 'react-query';
import { pick, mapValues, keyBy } from 'lodash';

import { useNamespace, useOkapiKy, useStripes } from '@folio/stripes/core';
import { getCapabilitiesGroupedByTypeAndResource } from '../settings/utils';
import { CAPABILITES_LIMIT } from './constants';

const useRoleCapabilitySets = (roleId) => {
  const stripes = useStripes();
  const installedApplications = Object.keys(stripes.discovery.applications);
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

  const capabilitySetAppIds = useMemo(() => {
    const capabilitySetsById = mapValues(keyBy(data?.capabilitySets, 'applicationId'), () => true) || {};
    const filteredByInstalledApplications = pick(capabilitySetsById, installedApplications);

    return filteredByInstalledApplications;
    // stripes.discovery is configured during application initialization
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return { initialRoleCapabilitySetsSelectedMap,
    isSuccess,
    capabilitySetsTotalCount: data?.totalRecords || 0,
    groupedRoleCapabilitySetsByType,
    capabilitySetsCapabilities,
    capabilitySetAppIds };
};

export default useRoleCapabilitySets;

