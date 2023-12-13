import React from 'react';

import PropTypes from 'prop-types';
import { RoleDetailsContext } from './RoleDetailsContext';
import { getKeyBasedArrayGroup } from '../../../../utils';
import { capabilitiesPropType } from '../../../../types';
import useRoleCapabilities from '../../../../../hooks/useRoleCapabilities';

const RoleDetailsContextProvider = ({ role, capabilitiesList, children }) => {
  const { initialRoleCapabilitiesSelectedMap, capabilitiesTotalCount } = useRoleCapabilities(role?.id);
  return <RoleDetailsContext.Provider
    value={{ role,
      capabilitiesTotalCount,
      capabilities:  getKeyBasedArrayGroup(capabilitiesList, 'type'),
      initialRoleCapabilitiesSelectedMap }}
  >
    {children}
  </RoleDetailsContext.Provider>;
};

RoleDetailsContextProvider.propTypes = { role: PropTypes.object.isRequired,
  capabilitiesList: capabilitiesPropType,
  children: PropTypes.node.isRequired };

export { RoleDetailsContextProvider };
