import { useChunkedCQLFetch } from '@folio/stripes/core';
import { CAPABILITES_LIMIT } from './constants';

export default function useChunkedApplicationCapabilities(appIds) {
  const { items, isLoading } = useChunkedCQLFetch({
    endpoint: 'capabilities',
    ids: appIds,
    limit: CAPABILITES_LIMIT,
    idName: 'applicationId',
    reduceFunction: data => data.flatMap(d => d.data?.capabilities || []),
    STEP_SIZE: 1
  });

  return { items, isLoading };
}
