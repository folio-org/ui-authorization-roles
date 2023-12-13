import React from 'react';
import { useQuery } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

const useRoleCapabilities = (roleId) => {
  const ky = useOkapiKy();

  const { data, isSuccess } = useQuery(['capabilities', roleId],
    () => ky.get(`roles/${roleId}/capabilities`).json());

  if (!roleId) return {};

  const initialRoleCapabilitiesSelectedMap = data?.capabilities.reduce((acc, capability) => {
    acc[capability.id] = true;
    return acc;
  }, {}) || {};

  return { initialRoleCapabilitiesSelectedMap, isSuccess, capabilitiesTotalCount: data?.totalRecords || 0 };
};

export default useRoleCapabilities;
