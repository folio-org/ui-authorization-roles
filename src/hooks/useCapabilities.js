import React, { useMemo } from 'react';
import { useQuery } from 'react-query';

import { useNamespace, useOkapiKy } from '@folio/stripes/core';

import { CAPABILITES_LIMIT } from './constants';
import { getCapabilitiesGroupedByTypeAndResource } from '../settings/utils';

const useCapabilities = () => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'capabilities-list' });

  const { data, isSuccess } = useQuery(
    namespace,
    () => ky.get(`capabilities?limit=${CAPABILITES_LIMIT}&query=cql.allRecords=1`).json(),
  );

  const groupedCapabilitiesByType = useMemo(() => {
    return getCapabilitiesGroupedByTypeAndResource(data?.capabilities || []);
  }, [data]);

  return { capabilitiesList: data?.capabilities || [],
    groupedCapabilitiesByType,
    isSuccess };
};

export default useCapabilities;
