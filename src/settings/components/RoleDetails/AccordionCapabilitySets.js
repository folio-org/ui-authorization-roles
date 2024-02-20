import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  Badge,
  Loading,
} from '@folio/stripes/components';


import { CapabilitiesSection } from '../Capabilities/CapabilitiesSection';
import useRoleCapabilitySets from '../../../hooks/useRoleCapabilitySets';

const RoleDetails = ({ roleId }) => {
  const {
    groupedRoleCapabilitySetsByType,
    capabilitySetsTotalCount,
    initialRoleCapabilitySetsSelectedMap,
    isSuccess
  } = useRoleCapabilitySets(roleId);

  if (!isSuccess) {
    return <Loading />;
  }

  const isCapabilitySetSelected = (capabilitySetId) => !!initialRoleCapabilitySetsSelectedMap[capabilitySetId];

  return (
    <Accordion
      closedByDefault
      label={<FormattedMessage id="ui-authorization-roles.details.capabilitySets" />}
      displayWhenClosed={
        <Badge>
          {capabilitySetsTotalCount}
        </Badge>
      }
    >
      <CapabilitiesSection isCapabilitySelected={isCapabilitySetSelected} capabilities={groupedRoleCapabilitySetsByType} readOnly />
    </Accordion>
  );
};

RoleDetails.propTypes = {
  roleId: PropTypes.string.isRequired
};

export default RoleDetails;
