import { useChunkedCQLFetch, useNamespace, useStripes } from '@folio/stripes/core';

import { CAPABILITES_LIMIT } from './constants';

// When fetching from a potentially large list of capabilities,
// single application can include more that 2000 capabilities,
// make sure to chunk the request to avoid hitting limits.

const useCapabilities = () => {
  const stripes = useStripes();
  const installedApplications = Object.keys(stripes.discovery.applications);
  const [namespace] = useNamespace({ key: 'capabilities-list' });

  const { items, isLoading } = useChunkedCQLFetch({
    endpoint: 'capabilities',
    ids: installedApplications,
    limit: CAPABILITES_LIMIT,
    idName: 'applicationId',
    reduceFunction: data => {
      return data.flatMap(d => d.data?.capabilities || []);
    },
    generateQueryKey: ({ chunkedItem, endpoint }) => {
      return [namespace, endpoint, chunkedItem];
    },
    STEP_SIZE: 1
  });



  return { capabilitiesList: items,
    isLoading };
};

export default useCapabilities;
