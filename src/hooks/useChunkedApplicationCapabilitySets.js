import { useChunkedCQLFetch } from '@folio/stripes/core';
import { isEmpty } from 'lodash';
import { APPLICATIONS_STEP_SIZE, CAPABILITES_LIMIT } from './constants';

// When fetching from a potentially large list of applications derived from appIds list
// make sure to chunk the request to avoid hitting limits.

export default function useChunkedApplicationCapabilitySets(appIds) {
  const { items, isLoading } = useChunkedCQLFetch({
    endpoint: 'capability-sets',
    ids: appIds,
    limit: CAPABILITES_LIMIT,
    idName: 'applicationId',
    queryOptions:{
      enabled: !isEmpty(appIds)
    },
    reduceFunction: data => data.flatMap(d => d.data?.capabilitySets || []),
    STEP_SIZE: APPLICATIONS_STEP_SIZE
  });

  return { items, isLoading };
}
