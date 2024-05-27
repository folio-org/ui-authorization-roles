import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  Badge,
  Loading,
} from '@folio/stripes/components';


import { CapabilitiesSection } from '../Capabilities/CapabilitiesSection';
import useRoleCapabilities from '../../../hooks/useRoleCapabilities';


const AccordionCapabilities = ({ roleId }) => {
  const {
    capabilitiesTotalCount,
    initialRoleCapabilitiesSelectedMap,
    groupedRoleCapabilitiesByType,
    isSuccess
  } = useRoleCapabilities(roleId, true);

  if (!isSuccess) {
    return <Loading />;
  }

  const isCapabilitySelected = (capabilityId) => !!initialRoleCapabilitiesSelectedMap[capabilityId];

  return (
    <Accordion
      closedByDefault
      label={<FormattedMessage id="ui-authorization-roles.details.capabilities" />}
      displayWhenClosed={
        <Badge>
          {capabilitiesTotalCount}
        </Badge>
    }
    >
      <CapabilitiesSection isCapabilitySelected={isCapabilitySelected} capabilities={groupedRoleCapabilitiesByType} readOnly />
    </Accordion>
  );
};

AccordionCapabilities.propTypes = {
  roleId: PropTypes.string.isRequired
};

export default AccordionCapabilities;
