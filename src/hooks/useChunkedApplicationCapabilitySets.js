import { useChunkedCQLFetch } from '@folio/stripes/core';
import { CAPABILITES_LIMIT } from './constants';

export default function useChunkedApplicationCapabilitySets(appIds) {
  const { items, isLoading } = useChunkedCQLFetch({
    endpoint: 'capability-sets',
    ids: appIds,
    limit: CAPABILITES_LIMIT,
    idName: 'applicationId',
    reduceFunction: data => data.flatMap(d => d.data?.capabilitySets || []),
    STEP_SIZE: 1
  });

  return { items, isLoading };
}
