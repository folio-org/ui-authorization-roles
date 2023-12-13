import React, { useContext } from 'react';

import { RoleDetailsContext } from '../RoleDetails/context/RoleDetailsContext';
import { CapabilitiesSection } from './CapabilitiesSection';

export const RoleDetailsCapabilities = () => {
  const { capabilities, initialRoleCapabilitiesSelectedMap } = useContext(RoleDetailsContext);
  const isCapabilitySelected = (id) => initialRoleCapabilitiesSelectedMap[id];

  return <CapabilitiesSection isCapabilitySelected={isCapabilitySelected} capabilities={capabilities} readOnly />;
};


