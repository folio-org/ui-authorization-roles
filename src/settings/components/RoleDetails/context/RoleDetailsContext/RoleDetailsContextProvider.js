import React from 'react';

import PropTypes from 'prop-types';
import { RoleDetailsContext } from './RoleDetailsContext';


const RoleDetailsContextProvider = ({ children, groupedCapabilitiesByType }) => {
  return <RoleDetailsContext.Provider
    value={{ groupedCapabilitiesByType }}
  >
    {children}
  </RoleDetailsContext.Provider>;
};

RoleDetailsContextProvider.propTypes = { groupedCapabilitiesByType: PropTypes.object.isRequired,
  children: PropTypes.node };

export { RoleDetailsContextProvider };
