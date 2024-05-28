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
    setDisabledCapabilities({});
  };

  const onSubmitSelectApplications = (appIds, onClose) => {
    // cleanup is preventing users from interacting with data that might no longer be available after selection
    cleanupCapabilitiesData();
    onClose?.();
    setCheckedAppIdsMap(appIds);
  };

  const onInitialLoad = (appIds) => setCheckedAppIdsMap(appIds);
  const selectedAppIds = extractSelectedIdsFromObject(checkedAppIdsMap);

  const { items:capabilities, isLoading: isCapabilitiesLoading } = useChunkedApplicationCapabilities(selectedAppIds);
  const { items: capabilitySets, isLoading: isCapabilitySetsLoading } = useChunkedApplicationCapabilitySets(selectedAppIds);

  useEffect(() => {
    if (!isCapabilitiesLoading) {
      const updatedSelectedCapabilitiesMap = getOnlyIntersectedWithApplicationsCapabilities(capabilities, roleCapabilitiesListIds);
      setSelectedCapabilitiesMap(updatedSelectedCapabilitiesMap);
    }
    // isCapabilitiesLoading only information we need to know if capabilities fetched
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCapabilitiesLoading]);

  useEffect(() => {
    if (!isCapabilitySetsLoading) {
      const updatedSelectedCapabilitySetsMap = getOnlyIntersectedWithApplicationsCapabilities(capabilitySets, roleCapabilitySetsListIds);
      setSelectedCapabilitySetsMap(updatedSelectedCapabilitySetsMap);
    }
    // isCapabilitySetsLoading only information we need to know if capability sets fetched
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCapabilitySetsLoading]);

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
    capabilitySetsList: capabilitySets,
    selectedCapabilitySetsMap,
    setSelectedCapabilitySetsMap,
    disabledCapabilities,
    setDisabledCapabilities,
    roleCapabilitySetsListIds,
    isInitialLoaded: !isCapabilitiesLoading && !isCapabilitySetsLoading };
};

export default useApplicationCapabilities;

