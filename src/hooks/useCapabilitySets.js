import React from 'react';
import { useQuery } from 'react-query';

import { useNamespace, useOkapiKy } from '@folio/stripes/core';

const LIMIT = 5000;

const useCapabilitySets = () => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'capability-sets' });

  const { data, isSuccess } = useQuery(
    namespace,
    () => ky.get(`capability-sets?limit=${LIMIT}&query=cql.allRecords=1 sortby resource`).json(),
  );

  return { data, isSuccess };
};

export default useCapabilitySets;
