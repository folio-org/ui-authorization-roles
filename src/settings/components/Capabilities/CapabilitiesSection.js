import React from 'react';
import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';

import { CapabilitiesSettings } from './CapabilitiesSettings';
import { CapabilitiesProcedural } from './CapabilitiesProcedural';
import { CapabilitiesDataType } from './CapabilitiesDataType';

const CapabilitiesSection = ({ capabilities, readOnly, onChangeCapabilityCheckbox }) => (
  <section>
    {capabilities?.data && <CapabilitiesDataType onChangeCapabilityCheckbox={onChangeCapabilityCheckbox} readOnly={readOnly} content={capabilities.data} />}
    {capabilities?.settings && <CapabilitiesSettings onChangeCapabilityCheckbox={onChangeCapabilityCheckbox} readOnly={readOnly} content={capabilities.settings} />}
    {capabilities?.procedural && <CapabilitiesProcedural onChangeCapabilityCheckbox={onChangeCapabilityCheckbox} readOnly={readOnly} content={capabilities.procedural} />}
    <p id="asterisk-policy-desc"><FormattedMessage id="ui-authorization-roles.details.nonSinglePolicyText" /></p>
  </section>
);

CapabilitiesSection.propTypes = { capabilities: PropTypes.object.isRequired,
  readOnly: PropTypes.bool,
  onChangeCapabilityCheckbox: PropTypes.func };

export { CapabilitiesSection };
