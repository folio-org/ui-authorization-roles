import { useState } from 'react';

import { useOkapiKy } from '@folio/stripes/core';
import { isEmpty } from 'lodash';
import { useStripes } from '@folio/stripes-core';
import { getCapabilitiesGroupedByTypeAndResource } from '../settings/utils';

// how many capabilites to retrieve in one swell foop.
// the default stripes limit is too small but it doesn't feel like
// raising that value application-wide is appropriate.
// see also useCapabilites which implements an identical constant
const LIMIT = 5000;

/**
 * A hook for managing application capabilities.
 *
 * checkedAppIdsMap -checkedAppIdsMap - store application IDs that have been checked. Helpful when user closes and re-opens applications modal.
 * @returns {Object} An object containing the checkedAppIdsMap and onSubmitSelectApplications function.
 */
const useApplicationCapabilities = () => {
  const stripes = useStripes();
  const [checkedAppIdsMap, setCheckedAppIdsMap] = useState({});
  const [capabilities, setCapabilities] = useState({ data: [], procedural: [], settings: [] });
  const [capabilitySets, setCapabilitySets] = useState({ data: [], procedural: [], settings: [] });
  const [capabilitySetsList, setCapabilitySetsList] = useState([]);
  const [disabledCapabilities, setDisabledCapabilities] = useState({});
  const [selectedCapabilitiesMap, setSelectedCapabilitiesMap] = useState({});
  const [selectedCapabilitySetsMap, setSelectedCapabilitySetsMap] = useState({});

  const ky = useOkapiKy();

  const roleCapabilitiesListIds = Object.entries(selectedCapabilitiesMap).filter(([, isSelected]) => isSelected).map(([id]) => id);
  const roleCapabilitySetsListIds = Object.entries(selectedCapabilitiesMap).filter(([, isSelected]) => isSelected).map(([id]) => id);

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
    return ky.get(`capabilities?limit=${LIMIT}&query=${queryByApplications} sortby resource`).json();
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
    roleCapabilitySetsListIds };
};

export default useApplicationCapabilities;

