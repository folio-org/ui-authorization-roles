import { useEffect, useMemo, useState } from 'react';

import { getCapabilitiesGroupedByTypeAndResource,
  getOnlyIntersectedWithApplicationsCapabilities,
  extractSelectedIdsFromObject } from '../settings/utils';
import useChunkedApplicationCapabilities from './useChunkedApplicationCapabilities';
import useChunkedApplicationCapabilitySets from './useChunkedApplicationCapabilitySets';

/**
 * A hook for managing application capabilities.
 *
 * checkedAppIdsMap -checkedAppIdsMap - store application IDs that have been checked. Helpful when user closes and re-opens applications modal.
 * @returns {Object} An object containing the checkedAppIdsMap and onSubmitSelectApplications function.
 */
const useApplicationCapabilities = () => {
  const [checkedAppIdsMap, setCheckedAppIdsMap] = useState({});
  const [disabledCapabilities, setDisabledCapabilities] = useState({});
  const [selectedCapabilitiesMap, setSelectedCapabilitiesMap] = useState({});
  const [selectedCapabilitySetsMap, setSelectedCapabilitySetsMap] = useState({});

  const roleCapabilitiesListIds = extractSelectedIdsFromObject(selectedCapabilitiesMap);
  const roleCapabilitySetsListIds = extractSelectedIdsFromObject(selectedCapabilitySetsMap);

  const cleanupCapabilitiesData = () => {
    setSelectedCapabilitiesMap({});
    setSelectedCapabilitySetsMap({});
  };

  const onSubmitSelectApplications = (appIds, onClose) => {
    // cleanup is preventing users from interacting with data that might no longer be available after selection
    cleanupCapabilitiesData();
    onClose?.();
    setCheckedAppIdsMap(appIds);
  };

  const onInitialLoad = (appIds) => setCheckedAppIdsMap(appIds);

  const { items:capabilities, isLoading } = useChunkedApplicationCapabilities(extractSelectedIdsFromObject(checkedAppIdsMap));
  const { items: capabilitySets, isLoading: isCapabilitySetsLoading } = useChunkedApplicationCapabilitySets(extractSelectedIdsFromObject(checkedAppIdsMap));

  useEffect(() => {
    if (!isLoading) {
      const updatedSelectedCapabilitiesMap = getOnlyIntersectedWithApplicationsCapabilities(capabilities, roleCapabilitiesListIds);
      setSelectedCapabilitiesMap(updatedSelectedCapabilitiesMap);
    }
  }, [capabilities, roleCapabilitiesListIds]);

  useEffect(() => {
    if (!isCapabilitySetsLoading) {
      const updatedSelectedCapabilitySetsMap = getOnlyIntersectedWithApplicationsCapabilities(capabilitySets, roleCapabilitySetsListIds);
      setSelectedCapabilitySetsMap(updatedSelectedCapabilitySetsMap);
    }
  }, [capabilitySets, roleCapabilitySetsListIds]);

  const memoizedCapabilities = useMemo(() => getCapabilitiesGroupedByTypeAndResource(capabilities),
    [capabilities]);

  const memoizedCapabilitySets = useMemo(() => getCapabilitiesGroupedByTypeAndResource(capabilitySets),
    [capabilitySets]);

  return { checkedAppIdsMap,
    capabilities: memoizedCapabilities,
    selectedCapabilitiesMap,
    roleCapabilitiesListIds,
    onSubmitSelectApplications,
    setSelectedCapabilitiesMap,
    onInitialLoad,
    capabilitySets:memoizedCapabilitySets,
    selectedCapabilitySetsMap,
    setSelectedCapabilitySetsMap,
    disabledCapabilities,
    setDisabledCapabilities,
    roleCapabilitySetsListIds,
    isInitialLoaded: !isLoading };
};

export default useApplicationCapabilities;

