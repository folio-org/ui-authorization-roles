import { useState } from 'react';

import { useOkapiKy, useStripes } from '@folio/stripes/core';
import { isEmpty } from 'lodash';
import { getCapabilitiesGroupedByTypeAndResource } from '../settings/utils';

/**
 * A hook for managing application capabilities.
 *
 * checkedAppIdsMap -checkedAppIdsMap - store application IDs that have been checked. Helpful when user closes and re-opens applications modal.
 * @returns {Object} An object containing the checkedAppIdsMap and onSubmitSelectApplications function.
 */
const useApplicationCapabilities = () => {
  const [checkedAppIdsMap, setCheckedAppIdsMap] = useState({});
  const [capabilities, setCapabilities] = useState({ data: [], procedural: [], settings: [] });
  const [selectedCapabilitiesMap, setSelectedCapabilitiesMap] = useState({});

  const ky = useOkapiKy();
  const stripes = useStripes();

  const roleCapabilitiesListIds = Object.entries(selectedCapabilitiesMap).filter(([, isSelected]) => isSelected).map(([id]) => id);

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
    return ky.get(`capabilities?limit=${stripes.config.maxUnpagedResourceCount}&query=${queryByApplications} sortby resource`).json();
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
      const data = await requestApplicationCapabilitiesList(listOfIds);

      setCapabilities(getCapabilitiesGroupedByTypeAndResource(data.capabilities));
      const updatedSelectedCapabilitiesMap = getOnlyIntersectedWithApplicationsCapabilities(data.capabilities);
      setSelectedCapabilitiesMap(updatedSelectedCapabilitiesMap);
      onClose?.();
    } catch (error) {
      console.error(error); // eslint-disable-line no-console
    }
  };

  const onInitialLoad = async (appIds) => {
    try {
      const data = await requestApplicationCapabilitiesList(Object.keys(appIds));
      setCheckedAppIdsMap(appIds);
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
    onInitialLoad };
};

export default useApplicationCapabilities;

