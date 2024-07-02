import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  CapabilitiesSection,
  useRoleCapabilitySets,
} from '@folio/stripes-authorization-components';
import {
  Accordion,
  Badge,
  Loading,
} from '@folio/stripes/components';

const AccordionCapabilitySets = ({ roleId }) => {
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
      <CapabilitiesSection
        readOnly
        isCapabilitySelected={isCapabilitySetSelected}
        capabilities={groupedRoleCapabilitySetsByType}
      />
    </Accordion>
  );
};

AccordionCapabilitySets.propTypes = {
  roleId: PropTypes.string.isRequired
};

export default AccordionCapabilitySets;
