import React from 'react';

import { FormattedMessage } from 'react-intl';
import {
  Accordion,
  Button,
  Loading,
} from '@folio/stripes/components';
import { Pluggable } from '@folio/stripes/core';

import PropTypes from 'prop-types';
import { CapabilitiesSection } from '../Capabilities/CapabilitiesSection';
import css from '../../style.css';


function CapabilitiesAccordion({ checkedAppIdsMap,
  onSaveSelectedApplications,
  isCapabilitySelected,
  onChangeCapabilityCheckbox,
  isCapabilityDisabled,
  capabilities, isLoading }) {
  return (
    <Accordion
      label={<><FormattedMessage id="ui-authorization-roles.details.capabilities" />{isLoading && <span className={css.loadingInTitle}> <Loading /></span>}</>}
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
      {!isLoading && <p id="asterisk-policy-desc"><FormattedMessage id="ui-authorization-roles.details.nonSinglePolicyText" /></p>}
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
  setCapabilitiesRendered: PropTypes.func,
  isLoading: PropTypes.bool
};

export default CapabilitiesAccordion;
