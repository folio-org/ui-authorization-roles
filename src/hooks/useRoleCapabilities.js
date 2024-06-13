import React, { useMemo } from 'react';
import { useQuery } from 'react-query';

import { useNamespace, useOkapiKy, useStripes } from '@folio/stripes/core';
import { pick, mapValues, keyBy } from 'lodash';

import { CAPABILITES_LIMIT } from './constants';
import { getCapabilitiesGroupedByTypeAndResource } from '../settings/utils';

const useRoleCapabilities = (roleId, expand = false) => {
  const stripes = useStripes();
  const installedApplications = Object.keys(stripes.discovery.applications);
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'role-capabilities-list' });

  const { data, isSuccess } = useQuery([namespace, roleId],
    () => ky.get(
      `roles/${roleId}/capabilities`,
      {
        searchParams: {
          limit: CAPABILITES_LIMIT,
          query: 'cql.allRecords=1 sortby resource',
          expand: !!expand,
        },
      }
    ).json(),
    {
      enabled: !!roleId,
      placeholderData: {
        capabilities: [], totalRecords: 0
      }
    });

  const initialRoleCapabilitiesSelectedMap = useMemo(() => {
    return data?.capabilities.reduce((acc, capability) => {
      acc[capability.id] = true;
      return acc;
    }, {}) || {};
  }, [data]);

  const groupedRoleCapabilitiesByType = useMemo(() => {
    return getCapabilitiesGroupedByTypeAndResource(data?.capabilities || []);
  }, [data]);

  const capabilitiesAppIds = useMemo(() => {
    const capabilitiesById = mapValues(keyBy(data?.capabilities, 'applicationId'), () => true) || {};
    const filteredByInstalledApplications = pick(capabilitiesById, installedApplications);

    return filteredByInstalledApplications;
    // stripes.discovery is configured during application initialization
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return { initialRoleCapabilitiesSelectedMap,
    isSuccess,
    capabilitiesTotalCount: data?.totalRecords || 0,
    groupedRoleCapabilitiesByType,
    capabilitiesAppIds };
};

export default useRoleCapabilities;
