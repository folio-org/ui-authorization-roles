import React, { useMemo } from 'react';
import { useQuery } from 'react-query';

import { useOkapiKy, useStripes } from '@folio/stripes/core';
import { getKeyBasedArrayGroup } from '../settings/utils';

const useCapabilities = () => {
  const ky = useOkapiKy();
  const stripes = useStripes();

  const { data, isSuccess } = useQuery(
    'capabilities-list',
    () => ky.get(`capabilities?limit=${stripes.config.maxUnpagedResourceCount}&query=cql.allRecords=1 sortby resource`).json(),
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );

  const memoizedCapabilitiesList = useMemo(() => {
    return data?.capabilities || [];
  }, [data]);

  const groupedCapabilitiesByType = useMemo(()=>{
    return getKeyBasedArrayGroup(data?.capabilities || [], 'type');
  }, [data]);

  return { capabilitiesList: memoizedCapabilitiesList || [],
    groupedCapabilitiesByType,
    isSuccess };
};

export default useCapabilities;
