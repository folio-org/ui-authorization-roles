import React from 'react';
import { useQuery } from 'react-query';

import { useNamespace, useOkapiKy, useStripes } from '@folio/stripes/core';

const useCapabilities = () => {
  const ky = useOkapiKy();
  const stripes = useStripes();

  const [nameSpace] = useNamespace({ key: 'capabilities-list' });

  const { data, isSuccess } = useQuery(
    [nameSpace],
    () => ky.get(`capabilities?limit=${stripes.config.maxUnpagedResourceCount}&query=cql.allRecords=1 sortby resource`).json(),
    { enabled: true }
  );

  return { capabilitiesList: data?.capabilities || [],
    isSuccess };
};

export default useCapabilities;
