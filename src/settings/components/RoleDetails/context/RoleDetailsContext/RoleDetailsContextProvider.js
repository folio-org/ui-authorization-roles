import React, { useEffect, useState } from 'react';
import { cloneDeep, isEmpty } from 'lodash';

import PropTypes from 'prop-types';
import { RoleDetailsContext } from './RoleDetailsContext';
import { getKeyBasedArrayGroup } from '../../../../utils';
import { capabilitiesPropType } from '../../../../types';

const RoleDetailsContextProvider = ({ role, capabilitiesList, children }) => {
  const [capabilitiesData, setCapabilitiesData] = useState({ capabilities: {}, capabilitiesTotalCount:0 });

  useEffect(() => {
    if (!isEmpty(capabilitiesList)) {
      const copyOfCapabilities = cloneDeep(capabilitiesList);

      copyOfCapabilities.forEach((capability) => {
        if (role.capabilities.includes(capability.id)) {
          capability.actions[capability.action] = true;
        }

        capability.allParentIds?.forEach((parentId) => {
          if (role.capabilities.includes(parentId)) {
            capability.actions[capability.action] = true;
          }
        });
      });

      const checkedCapabilitiesCount = copyOfCapabilities.reduce((acc, capability) => {
        // eslint-disable-next-line no-param-reassign
        acc += Object.values(capability.actions).filter(bool => bool).length;
        return acc;
      }, 0);

      setCapabilitiesData({ capabilities: getKeyBasedArrayGroup(copyOfCapabilities, 'type'),
        capabilitiesTotalCount: checkedCapabilitiesCount });
    }
  }, [role, capabilitiesList]);

  return <RoleDetailsContext.Provider
    value={{ role,
      capabilitiesTotalCount: capabilitiesData.capabilitiesTotalCount,
      capabilities:  capabilitiesData.capabilities }}
  >
    {children}
  </RoleDetailsContext.Provider>;
};

RoleDetailsContextProvider.propTypes = { role: PropTypes.object.isRequired,
  capabilitiesList: capabilitiesPropType,
  children: PropTypes.node.isRequired };

export { RoleDetailsContextProvider };
