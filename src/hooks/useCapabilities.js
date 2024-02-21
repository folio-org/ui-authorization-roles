import React, { useMemo } from 'react';
import { useQuery } from 'react-query';

import { useNamespace, useOkapiKy } from '@folio/stripes/core';
import { getCapabilitiesGroupedByTypeAndResource } from '../settings/utils';

// how many capabilites to retrieve in one swell foop.
// the default stripes limit is too small but it doesn't feel like
// raising that value application-wide is appropriate.
// see also useApplicationCapabilites which implements an identical constant
const LIMIT = 5000;

const useCapabilities = () => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'capabilities-list' });

  const { data, isSuccess } = useQuery(
    namespace,
    () => ky.get(`capabilities?limit=${LIMIT}&query=cql.allRecords=1 sortby resource`).json(),
  );

  const groupedCapabilitiesByType = useMemo(() => {
    return getCapabilitiesGroupedByTypeAndResource(data?.capabilities || []);
  }, [data]);

  return { capabilitiesList: data?.capabilities || [],
    groupedCapabilitiesByType,
    isSuccess };
};

export default useCapabilities;
