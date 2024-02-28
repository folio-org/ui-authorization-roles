import { useState } from 'react';

import { useOkapiKy } from '@folio/stripes/core';
import { isEmpty } from 'lodash';
import { useStripes } from '@folio/stripes-core';

import { CAPABILITES_LIMIT } from './constants';
import { getCapabilitiesGroupedByTypeAndResource } from '../settings/utils';

/**
 * A hook for managing application capabilities.
 *
 * checkedAppIdsMap -checkedAppIdsMap - store application IDs that have been checked. Helpful when user closes and re-opens applications modal.
 * @returns {Object} An object containing the checkedAppIdsMap and onSubmitSelectApplications function.
 */
const useApplicationCapabilities = () => {
  const stripes = useStripes();
  /* isInitialLoaded is the state that indicates capabilitySets and capabilities data is loaded, since they are depend on each other.
  Based on this we show spinner on accordion
  */
  const [isInitialLoaded, setIsInitialLoaded] = useState(false);

  const [checkedAppIdsMap, setCheckedAppIdsMap] = useState({});
  const [capabilities, setCapabilities] = useState({ data: [], procedural: [], settings: [] });
  const [capabilitySets, setCapabilitySets] = useState({ data: [], procedural: [], settings: [] });
  const [capabilitySetsList, setCapabilitySetsList] = useState([]);
  const [disabledCapabilities, setDisabledCapabilities] = useState({});
  const [selectedCapabilitiesMap, setSelectedCapabilitiesMap] = useState({});
  const [selectedCapabilitySetsMap, setSelectedCapabilitySetsMap] = useState({});

  const ky = useOkapiKy();

  const roleCapabilitiesListIds = Object.entries(selectedCapabilitiesMap).filter(([, isSelected]) => isSelected).map(([id]) => id);
  const roleCapabilitySetsListIds = Object.entries(selectedCapabilitySetsMap).filter(([, isSelected]) => isSelected).map(([id]) => id);

  const getOnlyIntersectedWithApplicationsCapabilities = (applicationCaps) => {
    if (isEmpty(applicationCaps)) return {};

    return applicationCaps.filter(cap => roleCapabilitiesListIds.includes(cap.id))
      .reduce((acc, cap) => {
        acc[cap.id] = true;
        return acc;
      }, {});
  };

  const requestApplicationCapabilitiesList = (listOfIds) => {
    const queryByApplications = listOfIds.map(appId => `applicationId=${appId}`).join(' or ');
    return ky.get(`capabilities?limit=${CAPABILITES_LIMIT}&query=${queryByApplications} sortby resource`).json();
  };

  const requestApplicationCapabilitySets = (listOfIds) => {
    const queryByApplications = listOfIds.map(appId => `applicationId=${appId}`).join(' or ');
    return ky.get(`capability-sets?limit=${stripes.config.maxUnpagedResourceCount}&query=${queryByApplications} sortby resource`).json();
  };

  const onSubmitSelectApplications = async (appIds, onClose) => {
    setCheckedAppIdsMap(appIds);
    const listOfIds = Object.entries(appIds).filter(([, isSelected]) => isSelected).map(([id]) => id);

    if (isEmpty(listOfIds)) {
      setCapabilities({ data: [], settings: [], procedural: [] });
      setSelectedCapabilitiesMap({});
      onClose?.();
      return;
    }

    try {
      const capabilitiesData = await requestApplicationCapabilitiesList(listOfIds);
      const capabilitySetsData = await requestApplicationCapabilitySets(listOfIds);

      setCapabilitySetsList(capabilitySetsData.capabilitySets);
      setCapabilities(getCapabilitiesGroupedByTypeAndResource(capabilitiesData.capabilities));
      setCapabilitySets(getCapabilitiesGroupedByTypeAndResource(capabilitySetsData.capabilitySets));
      const updatedSelectedCapabilitiesMap = getOnlyIntersectedWithApplicationsCapabilities(capabilitiesData.capabilities);
      const updatedSelectedCapabilitySetsMap = getOnlyIntersectedWithApplicationsCapabilities(capabilitySetsData.capabilitySets);
      setSelectedCapabilitiesMap(updatedSelectedCapabilitiesMap);
      setSelectedCapabilitySetsMap(updatedSelectedCapabilitySetsMap);
      setIsInitialLoaded(true);
      onClose?.();
    } catch (error) {
      console.error(error); // eslint-disable-line no-console
    }
  };

  const onInitialLoad = async (appIds) => {
    try {
      const data = await requestApplicationCapabilitiesList(Object.keys(appIds));
      const capabilitySetsData = await requestApplicationCapabilitySets(Object.keys(appIds));

      setCheckedAppIdsMap(appIds);

      setCapabilitySetsList(capabilitySetsData.capabilitySets);
      setCapabilitySets(getCapabilitiesGroupedByTypeAndResource(capabilitySetsData.capabilitySets));
      setCapabilities(getCapabilitiesGroupedByTypeAndResource(data.capabilities));
      setIsInitialLoaded(true);
    } catch (error) {
      console.error(error); // eslint-disable-line no-console
    }
  };

  return { checkedAppIdsMap,
    capabilities,
    selectedCapabilitiesMap,
    roleCapabilitiesListIds,
    onSubmitSelectApplications,
    setSelectedCapabilitiesMap,
    onInitialLoad,
    capabilitySets,
    selectedCapabilitySetsMap,
    setSelectedCapabilitySetsMap,
    disabledCapabilities,
    setDisabledCapabilities,
    capabilitySetsList,
    roleCapabilitySetsListIds,
    isInitialLoaded };
};

export default useApplicationCapabilities;

