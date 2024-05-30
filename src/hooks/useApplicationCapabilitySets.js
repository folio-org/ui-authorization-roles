import { useEffect, useMemo, useState } from 'react';

import { getCapabilitiesGroupedByTypeAndResource,
  getOnlyIntersectedWithApplicationsCapabilities,
  extractSelectedIdsFromObject } from '../settings/utils';
import useChunkedApplicationCapabilitySets from './useChunkedApplicationCapabilitySets';

const useApplicationCapabilitySets = (checkedAppIdsMap) => {
  const selectedAppIds = extractSelectedIdsFromObject(checkedAppIdsMap);
  const { items: capabilitySets, isLoading: isCapabilitySetsLoading } = useChunkedApplicationCapabilitySets(selectedAppIds);

  const [selectedCapabilitySetsMap, setSelectedCapabilitySetsMap] = useState({});
  const roleCapabilitySetsListIds = extractSelectedIdsFromObject(selectedCapabilitySetsMap);

  useEffect(() => {
    if (!isCapabilitySetsLoading) {
      const updatedSelectedCapabilitySetsMap = getOnlyIntersectedWithApplicationsCapabilities(capabilitySets, roleCapabilitySetsListIds);
      setSelectedCapabilitySetsMap(updatedSelectedCapabilitySetsMap);
    }
    // isCapabilitySetsLoading only information we need to know if capability sets fetched
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCapabilitySetsLoading]);

  const memoizedCapabilitySets = useMemo(() => getCapabilitiesGroupedByTypeAndResource(capabilitySets),
    [capabilitySets]);

  return { capabilitySets:memoizedCapabilitySets,
    capabilitySetsList: capabilitySets,
    selectedCapabilitySetsMap,
    setSelectedCapabilitySetsMap,
    roleCapabilitySetsListIds,
    isLoading: isCapabilitySetsLoading };
};

export default useApplicationCapabilitySets;

