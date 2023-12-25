import React, { memo } from 'react';
import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';

import { CapabilitiesSettings } from './CapabilitiesSettings';
import { CapabilitiesProcedural } from './CapabilitiesProcedural';
import { CapabilitiesDataType } from './CapabilitiesDataType';

/**
 * Renders the CapabilitiesSection component.
 *
 * @param {Object} capabilities - the capabilities object with keys 'data', 'settings' and 'procedural'
 * @param {boolean} readOnly - indicates if the component is read-only
 * @param {Function} onChangeCapabilityCheckbox - the callback function for when capability checkbox is changed
 * @param {Function} isCapabilitySelected - the callback function to check if capability is selected,
 * @return {JSX.Element} - the rendered CapabilitiesSection component
 */

const CapabilitiesSection = memo(({ capabilities, readOnly, onChangeCapabilityCheckbox, isCapabilitySelected }) => {
  return <section>
    {capabilities?.data && <CapabilitiesDataType isCapabilitySelected={isCapabilitySelected} onChangeCapabilityCheckbox={onChangeCapabilityCheckbox} readOnly={readOnly} content={capabilities.data} />}
    {capabilities?.settings && <CapabilitiesSettings isCapabilitySelected={isCapabilitySelected} onChangeCapabilityCheckbox={onChangeCapabilityCheckbox} readOnly={readOnly} content={capabilities.settings} />}
    {capabilities?.procedural && <CapabilitiesProcedural isCapabilitySelected={isCapabilitySelected} onChangeCapabilityCheckbox={onChangeCapabilityCheckbox} readOnly={readOnly} content={capabilities.procedural} />}
    <p id="asterisk-policy-desc"><FormattedMessage id="ui-authorization-roles.details.nonSinglePolicyText" /></p>
  </section>;
});

CapabilitiesSection.propTypes = { capabilities: PropTypes.object.isRequired,
  readOnly: PropTypes.bool,
  onChangeCapabilityCheckbox: PropTypes.func,
  isCapabilitySelected: PropTypes.func };

export { CapabilitiesSection };
