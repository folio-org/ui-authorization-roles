import { useState } from 'react';

import { useOkapiKy, useStripes } from '@folio/stripes/core';
import { isEmpty } from 'lodash';

const useApplicationCapabilities = () => {
  const [checkedAppIdsMap, setCheckedAppIdsMap] = useState({});
  const ky = useOkapiKy();
  const stripes = useStripes();

  const onSubmitSelectApplications = async ({ appIds, onClose, setSelectedCapabilitiesMap }) => {
    setCheckedAppIdsMap(appIds);
    const listOfIds = Object.entries(appIds).filter(([, isSelected]) => isSelected).map(([id]) => id);

    if (isEmpty(listOfIds)) {
      setSelectedCapabilitiesMap({});
      onClose();
      return;
    }

    try {
      const queryByApplications = listOfIds.map(appId => `applicationId=${appId}`).join(' or ');
      const data = await ky.get(`capabilities?limit=${stripes.config.maxUnpagedResourceCount}&query=${queryByApplications} sortby resource`).json();

      const caps = data.capabilities.reduce((acc, capability) => {
        acc[capability.id] = true;
        return acc;
      }, {});

      setSelectedCapabilitiesMap(caps);
      onClose();
    } catch (error) {
      console.error(error); // eslint-disable-line no-console
    }
  };

  return { checkedAppIdsMap, onSubmitSelectApplications };
};

export default useApplicationCapabilities;

