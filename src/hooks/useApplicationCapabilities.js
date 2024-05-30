import { useEffect, useMemo, useState } from 'react';

import { getCapabilitiesGroupedByTypeAndResource,
  getOnlyIntersectedWithApplicationsCapabilities,
  extractSelectedIdsFromObject } from '../settings/utils';
import useChunkedApplicationCapabilities from './useChunkedApplicationCapabilities';

const useApplicationCapabilities = (checkedAppIdsMap) => {
  const selectedAppIds = extractSelectedIdsFromObject(checkedAppIdsMap);
  const { items:capabilities, isLoading: isCapabilitiesLoading } = useChunkedApplicationCapabilities(selectedAppIds);

  const [selectedCapabilitiesMap, setSelectedCapabilitiesMap] = useState({});
  const roleCapabilitiesListIds = extractSelectedIdsFromObject(selectedCapabilitiesMap);

  useEffect(() => {
    if (!isCapabilitiesLoading) {
      const updatedSelectedCapabilitiesMap = getOnlyIntersectedWithApplicationsCapabilities(capabilities, roleCapabilitiesListIds);
      setSelectedCapabilitiesMap(updatedSelectedCapabilitiesMap);
    }
    // isCapabilitiesLoading only information we need to know if capabilities fetched
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCapabilitiesLoading]);

  const memoizedCapabilities = useMemo(() => getCapabilitiesGroupedByTypeAndResource(capabilities),
    [capabilities]);

  return { capabilities: memoizedCapabilities,
    selectedCapabilitiesMap,
    roleCapabilitiesListIds,
    setSelectedCapabilitiesMap,
    isLoading: isCapabilitiesLoading };
};

export default useApplicationCapabilities;

