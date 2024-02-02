import { useState } from 'react';

import { useOkapiKy, useStripes } from '@folio/stripes/core';
import { isEmpty } from 'lodash';
import { getCapabilitiesGroupedByTypeAndResource } from '../settings/utils';

/**
 * A hook for managing application capabilities.
 *
 * checkedAppIdsMap - to store applicaiton ids that have been checked. Helpful on the cases when user close applications modal and open it again.
 * @returns {Object} An object containing the checkedAppIdsMap and onSubmitSelectApplications function.
 */
const useApplicationCapabilities = () => {
  const [checkedAppIdsMap, setCheckedAppIdsMap] = useState({});
  const ky = useOkapiKy();
  const stripes = useStripes();

  const onSubmitSelectApplications = async ({ appIds, onClose, setCapabilities, handleSelectedCapabilitiesOnChangeSelectedApplication }) => {
    setCheckedAppIdsMap(appIds);
    const listOfIds = Object.entries(appIds).filter(([, isSelected]) => isSelected).map(([id]) => id);

    if (isEmpty(listOfIds)) {
      setCapabilities({ data: [], settings: [], procedural: [] });
      handleSelectedCapabilitiesOnChangeSelectedApplication([]);
      onClose();
      return;
    }

    try {
      const queryByApplications = listOfIds.map(appId => `applicationId=${appId}`).join(' or ');
      const data = await ky.get(`capabilities?limit=${stripes.config.maxUnpagedResourceCount}&query=${queryByApplications} sortby resource`).json();

      setCapabilities(getCapabilitiesGroupedByTypeAndResource(data.capabilities));
      handleSelectedCapabilitiesOnChangeSelectedApplication(data.capabilities);
      onClose();
    } catch (error) {
      console.error(error); // eslint-disable-line no-console
    }
  };

  return { checkedAppIdsMap, onSubmitSelectApplications };
};

export default useApplicationCapabilities;

