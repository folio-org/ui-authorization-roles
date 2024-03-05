import { useQuery } from 'react-query';

import { useNamespace, useOkapiKy } from '@folio/stripes/core';

import { CAPABILITES_LIMIT } from './constants';

const useCapabilities = () => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'capabilities-list' });

  const { data, isSuccess } = useQuery(
    namespace,
    () => ky.get(`capabilities?limit=${CAPABILITES_LIMIT}&query=cql.allRecords=1`).json(),
  );


  return { capabilitiesList: data?.capabilities,
    isSuccess };
};

export default useCapabilities;
