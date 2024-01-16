import React from 'react';
import PropTypes from 'prop-types';
import { CheckboxWithAsterisk } from '../../../components/CheckboxWithAsterisk/CheckboxWithAsterisk';
import { useCheckboxAriaStates } from './helpers';

const ItemActionCheckbox = ({
  item,
  action,
  onChangeCapabilityCheckbox,
  readOnly,
  isCapabilitySelected
}) => {
  const { getCheckboxAriaLabel } = useCheckboxAriaStates();

  if (!readOnly && !item.actions[action]) return null;

  return <CheckboxWithAsterisk
    aria-describedby="asterisk-policy-desc"
    aria-label={getCheckboxAriaLabel(action, item.resource)}
    onChange={event => {
      onChangeCapabilityCheckbox?.(event, item.actions[action]);
    }}
    readOnly={readOnly}
    checked={isCapabilitySelected(item.actions[action])}
  />;
};

ItemActionCheckbox.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    description: PropTypes.string,
    resource: PropTypes.string.isRequired,
    applicationId: PropTypes.string.isRequired,
    actions: PropTypes.object
  }),
  action: PropTypes.string.isRequired,
  onChangeCapabilityCheckbox: PropTypes.func,
  readOnly: PropTypes.bool,
  isCapabilitySelected: PropTypes.func
};
export default ItemActionCheckbox;
