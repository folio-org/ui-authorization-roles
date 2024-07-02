import { useChunkedCQLFetch, useNamespace, useStripes } from '@folio/stripes/core';

import {
  APPLICATIONS_STEP_SIZE,
  CAPABILITIES_LIMIT,
} from '@folio/stripes-authorization-components';

// When fetching from a potentially large list of applications derived
// from stripes.discovery.applications
// make sure to chunk the request to avoid hitting limits.

const useCapabilitySets = () => {
  const stripes = useStripes();
  const installedApplications = Object.keys(stripes.discovery.applications);
  const [namespace] = useNamespace({ key: 'capability-sets-list' });

  const { items, isLoading } = useChunkedCQLFetch({
    endpoint: 'capability-sets',
    ids: installedApplications,
    limit: CAPABILITIES_LIMIT,
    idName: 'applicationId',
    reduceFunction: data => {
      return data.flatMap(d => d.data?.capabilitySets || []);
    },
    generateQueryKey: ({ chunkedItem, endpoint }) => {
      return [namespace, endpoint, chunkedItem];
    },
    STEP_SIZE: APPLICATIONS_STEP_SIZE
  });

  return { capabilitySetsList: items,
    isLoading };
};

export default useCapabilitySets;
