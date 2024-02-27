import React from 'react';

import { FormattedMessage } from 'react-intl';
import {
  Accordion,
} from '@folio/stripes/components';
import PropTypes from 'prop-types';
import { CapabilitiesSection } from '../Capabilities/CapabilitiesSection';


function CapabilitySetAccordion({ isCapabilitySetSelected,
  onChangeCapabilitySetCheckbox,
  capabilitySets }) {
  return (
    <Accordion
      label={<FormattedMessage id="ui-authorization-roles.details.capabilitySets" />}
    >
      <CapabilitiesSection
        readOnly={false}
        isCapabilitySelected={isCapabilitySetSelected}
        onChangeCapabilityCheckbox={onChangeCapabilitySetCheckbox}
        capabilities={capabilitySets}
      />
    </Accordion>
  );
}

CapabilitySetAccordion.propTypes = {
  isCapabilitySetSelected: PropTypes.func,
  onChangeCapabilitySetCheckbox: PropTypes.func,
  capabilitySets: PropTypes.object,
};

export default CapabilitySetAccordion;
