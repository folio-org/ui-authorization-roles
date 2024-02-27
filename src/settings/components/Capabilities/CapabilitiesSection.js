import React from 'react';
import PropTypes from 'prop-types';

import { isEmpty } from 'lodash';
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

const CapabilitiesSection = ({ capabilities, readOnly, onChangeCapabilityCheckbox, isCapabilitySelected, isCapabilityDisabled }) => {
  return <section>
    {!isEmpty(capabilities.data) && <CapabilitiesDataType isCapabilityDisabled={isCapabilityDisabled} isCapabilitySelected={isCapabilitySelected} onChangeCapabilityCheckbox={onChangeCapabilityCheckbox} readOnly={readOnly} content={capabilities.data} />}
    {!isEmpty(capabilities.settings) && <CapabilitiesSettings isCapabilityDisabled={isCapabilityDisabled} isCapabilitySelected={isCapabilitySelected} onChangeCapabilityCheckbox={onChangeCapabilityCheckbox} readOnly={readOnly} content={capabilities.settings} />}
    {!isEmpty(capabilities.procedural) && <CapabilitiesProcedural isCapabilityDisabled={isCapabilityDisabled} isCapabilitySelected={isCapabilitySelected} onChangeCapabilityCheckbox={onChangeCapabilityCheckbox} readOnly={readOnly} content={capabilities.procedural} />}
  </section>;
};

CapabilitiesSection.propTypes = { capabilities: PropTypes.object.isRequired,
  readOnly: PropTypes.bool,
  onChangeCapabilityCheckbox: PropTypes.func,
  isCapabilitySelected: PropTypes.func,
  isCapabilityDisabled: PropTypes.func };

export { CapabilitiesSection };
