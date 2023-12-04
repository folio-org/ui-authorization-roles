import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';

import { useNamespace, useOkapiKy, useStripes } from '@folio/stripes/core';
import { isEmpty } from 'lodash';

const useCapabilities = () => {
  const ky = useOkapiKy();
  const stripes = useStripes();

  const [capabilities, setCapabilities] = useState([]);

  const onChangeCapabilityCheckbox = (event, id, field) => {
    setCapabilities(capabilities.map(capability => {
      if (capability.id === id) {
        return { ...capability, actions: { ...capability.actions, [field]: event.target.checked } };
      }

      return capability;
    }));
  };

  const [nameSpace] = useNamespace({ key: 'capabilities-list' });

  const { data } = useQuery(
    [nameSpace],
    () => ky.get(`capabilities?limit=${stripes.config.maxUnpagedResourceCount}&query=cql.allRecords=1 sortby applicationId`).json(),
    { enabled: true }
  );

  useEffect(() => {
    if (!isEmpty(data?.capabilities)) {
      setCapabilities(data?.capabilities?.map((capability) => ({
        ...capability,
        actions:{
          view: false,
          edit: false,
          create: false,
          delete: false,
          manage: false,
          execute: false
        }
      })));
    }
  }, [data]);


  return { data: capabilities,
    onChangeCapabilityCheckbox };
};

export default useCapabilities;
