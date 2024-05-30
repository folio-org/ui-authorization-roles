import { useChunkedCQLFetch } from '@folio/stripes/core';
import { isEmpty } from 'lodash';
import { APPLICATIONS_STEP_SIZE, CAPABILITES_LIMIT } from './constants';

// When fetching from a potentially large list of applications derived from appIds list
// make sure to chunk the request to avoid hitting limits.

export default function useChunkedApplicationCapabilities(appIds) {
  const { items, isLoading } = useChunkedCQLFetch({
    endpoint: 'capabilities',
    ids: appIds,
    limit: CAPABILITES_LIMIT,
    idName: 'applicationId',
    reduceFunction: data => data.flatMap(d => d.data?.capabilities || []),
    queryOptions:{
      enabled: !isEmpty(appIds)
    },
    STEP_SIZE: APPLICATIONS_STEP_SIZE
  });

  return { items, isLoading };
}
