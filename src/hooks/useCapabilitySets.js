import React, { useMemo } from 'react';
import { useQuery } from 'react-query';

import { useNamespace, useOkapiKy, useStripes } from '@folio/stripes/core';
import { getCapabilitiesGroupedByTypeAndResource } from '../settings/utils';

const useCapabilitySets = () => {
  const ky = useOkapiKy();
  const stripes = useStripes();
  const [namespace] = useNamespace({ key: 'capability-sets' });

  const { data, isSuccess } = useQuery(
    namespace,
    () => ky.get(`capability-sets?limit=${stripes.config.maxUnpagedResourceCount}&query=cql.allRecords=1 sortby resource`).json(),
  );

  const groupedCapabilitiesByType = useMemo(() => {
    return getCapabilitiesGroupedByTypeAndResource(data?.capabilitySets || []);
  }, [data]);

  return { groupedCapabilitiesByType, data, isSuccess };
};

export default useCapabilitySets;
