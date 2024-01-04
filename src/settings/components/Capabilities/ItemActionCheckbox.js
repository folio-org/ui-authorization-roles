import React from 'react';
import PropTypes from 'prop-types';
import { CheckboxWithAsterisk } from '../../../components/CheckboxWithAsterisk/CheckboxWithAsterisk';
import { useCheckboxAriaStates } from './helpers';
import { capabilitiesPropType } from '../../types';

const ItemActionCheckbox = ({
  item,
  action,
  onChangeCapabilityCheckbox,
  readOnly,
  isCapabilitySelected
}) => {
  const { getCheckboxAriaLabel } = useCheckboxAriaStates();

  if (!readOnly && item.action !== action) return null;
  return <CheckboxWithAsterisk
    aria-describedby="asterisk-policy-desc"
    aria-label={getCheckboxAriaLabel(action, item.resource)}
    onChange={event => onChangeCapabilityCheckbox?.(event, item.id)}
    readOnly={readOnly}
    checked={isCapabilitySelected(item.id) && action === item.action}
  />;
};

ItemActionCheckbox.propTypes = {
  item: capabilitiesPropType.isRequired,
  action: PropTypes.string.isRequired,
  onChangeCapabilityCheckbox: PropTypes.func,
  readOnly: PropTypes.bool,
  isCapabilitySelected: PropTypes.func
};
export default ItemActionCheckbox;
