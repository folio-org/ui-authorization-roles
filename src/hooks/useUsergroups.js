import { useQuery } from 'react-query';

import { useNamespace, useOkapiKy, useStripes } from '@folio/stripes/core';

const useUsergroups = () => {
  const ky = useOkapiKy();
  const stripes = useStripes();
  const [namespace] = useNamespace({ key: 'capabilities-list' });

  const { data, isLoading, isSuccess } = useQuery(
    namespace,
    () => ky.get(`groups?limit=${stripes.config.maxUnpagedResourceCount}&query=cql.allRecords=1 sortby desc`).json(),
  );

  return {
    usergroups: data?.usergroups,
    isLoading,
    isSuccess,
  };
};

export default useUsergroups;
