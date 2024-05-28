import { useChunkedCQLFetch, useNamespace, useStripes } from '@folio/stripes/core';

import { CAPABILITES_LIMIT } from './constants';

// When fetching from a potentially large list of capability sets,
// single application can include more that 2000 capability sets,
// make sure to chunk the request to avoid hitting limits.

const useCapabilitySets = () => {
  const stripes = useStripes();
  const installedApplications = Object.keys(stripes.discovery.applications);
  const [namespace] = useNamespace({ key: 'capability-sets-list' });

  const { items, isLoading } = useChunkedCQLFetch({
    endpoint: 'capability-sets',
    ids: installedApplications,
    limit: CAPABILITES_LIMIT,
    idName: 'applicationId',
    reduceFunction: data => {
      return data.flatMap(d => d.data?.capabilitySets || []);
    },
    generateQueryKey: ({ chunkedItem, endpoint }) => {
      return [namespace, endpoint, chunkedItem];
    },
    STEP_SIZE: 1
  });

  return { capabilitySetsList: items,
    isLoading };
};

export default useCapabilitySets;
