import React from 'react';

import { FormattedMessage } from 'react-intl';
import {
  Accordion, Loading,
} from '@folio/stripes/components';
import PropTypes from 'prop-types';
import { CapabilitiesSection } from '../Capabilities/CapabilitiesSection';
import css from '../../style.css';


function CapabilitySetAccordion({ isCapabilitySetSelected,
  onChangeCapabilitySetCheckbox,
  capabilitySets, isLoading }) {
  return (
    <Accordion
      label={<><FormattedMessage id="ui-authorization-roles.details.capabilitySets" /> {isLoading && <span className={css.loadingInTitle}> <Loading /></span>}</>}
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
  isLoading: PropTypes.bool
};

export default CapabilitySetAccordion;
