import React from 'react';

import { FormattedMessage } from 'react-intl';
import {
  Accordion,
  Button,
} from '@folio/stripes/components';
import { Pluggable } from '@folio/stripes/core';

import PropTypes from 'prop-types';
import { CapabilitiesSection } from '../Capabilities/CapabilitiesSection';


function CapabilitiesAccordion({ checkedAppIdsMap,
  onSaveSelectedApplications,
  isCapabilitySelected,
  onChangeCapabilityCheckbox,
  isCapabilityDisabled,
  capabilities }) {
  return (
    <Accordion
      label={<FormattedMessage id="ui-authorization-roles.details.capabilities" />}
      displayWhenOpen={
        <Pluggable
          type="select-application"
          checkedAppIdsMap={checkedAppIdsMap}
          onSave={onSaveSelectedApplications}
          renderTrigger={props => <Button icon="plus-sign" {...props}><FormattedMessage id="ui-authorization-roles.crud.selectApplication" /></Button>}
        />
                }
    >
      <CapabilitiesSection
        readOnly={false}
        isCapabilitySelected={isCapabilitySelected}
        onChangeCapabilityCheckbox={onChangeCapabilityCheckbox}
        capabilities={capabilities}
        isCapabilityDisabled={isCapabilityDisabled}
      />
      <p id="asterisk-policy-desc"><FormattedMessage id="ui-authorization-roles.details.nonSinglePolicyText" /></p>
    </Accordion>
  );
}

CapabilitiesAccordion.propTypes = {
  checkedAppIdsMap:PropTypes.object,
  onSaveSelectedApplications: PropTypes.func,
  isCapabilitySelected: PropTypes.func,
  onChangeCapabilityCheckbox: PropTypes.func,
  capabilities: PropTypes.object,
  isCapabilityDisabled:PropTypes.func,
};

export default CapabilitiesAccordion;
