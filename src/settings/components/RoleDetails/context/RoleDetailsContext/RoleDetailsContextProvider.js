import React from 'react';

import PropTypes from 'prop-types';
import { RoleDetailsContext } from './RoleDetailsContext';
import { getKeyBasedArrayGroup } from '../../../../utils';
import { capabilitiesPropType } from '../../../../types';

const RoleDetailsContextProvider = ({ role, capabilitiesList, children }) => {
  return <RoleDetailsContext.Provider
    value={{ role,
      capabilitiesTotalCount: role?.capabilities?.length || 0,
      capabilities:  getKeyBasedArrayGroup(capabilitiesList, 'type') }}
  >
    {children}
  </RoleDetailsContext.Provider>;
};

RoleDetailsContextProvider.propTypes = { role: PropTypes.object.isRequired,
  capabilitiesList: capabilitiesPropType,
  children: PropTypes.node.isRequired };

export { RoleDetailsContextProvider };
