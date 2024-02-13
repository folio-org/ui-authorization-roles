import React, { useMemo } from 'react';
import { useQuery } from 'react-query';

import { useNamespace, useOkapiKy, useStripes } from '@folio/stripes/core';
import { getCapabilitiesGroupedByTypeAndResource } from '../settings/utils';

const useCapabilities = () => {
  const ky = useOkapiKy();
  const stripes = useStripes();
  const [namespace] = useNamespace({ key: 'capabilities-list' });

  const { data, isSuccess } = useQuery(
    namespace,
    () => ky.get(`capabilities?limit=${stripes.config.maxUnpagedResourceCount}&query=cql.allRecords=1 sortby resource`).json(),
  );

  const groupedCapabilitiesByType = useMemo(() => {
    return getCapabilitiesGroupedByTypeAndResource(data?.capabilities || []);
  }, [data]);

  return { capabilitiesList: data?.capabilities || [],
    groupedCapabilitiesByType,
    isSuccess };
};

export default useCapabilities;
