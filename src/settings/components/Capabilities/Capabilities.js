import React, { useContext } from 'react';

import { RoleDetailsContext } from '../RoleDetails/context/RoleDetailsContext';
import { CapabilitiesSection } from './CapabilitiesSection';

export const Capabilities = () => {
  const { capabilities } = useContext(RoleDetailsContext);

  return <CapabilitiesSection capabilities={capabilities} readOnly />;
};


