import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import { MultiColumnList, Headline } from '@folio/stripes/components';

import { getApplicationName } from '../../utils';
import { CheckBoxWithAsterisk } from '../../../components/CheckBoxWithAsterisk/CheckBoxWithAsterisk';
import { capabilitiesPropType } from '../../types';
import { columnTranslations } from '../../../constants/translations';
import { useCheckboxAriaStates } from './helpers';

import css from '../../style.css';

const CapabilitiesSettings = ({ content, readOnly, onChangeCapabilityCheckbox }) => {
  const { getCheckBoxAriaLabel, formatMessage } = useCheckboxAriaStates();

  const columnMapping = {
    application: formatMessage(columnTranslations.application),
    resource:formatMessage(columnTranslations.resource),
    view: formatMessage(columnTranslations.view),
    edit: formatMessage(columnTranslations.edit),
    manage: formatMessage(columnTranslations.manage),
    // policies: formatMessage(columnTranslations.policies
  };

  const resultsFormatter = {
    application: item => getApplicationName(item.applicationId),
    resource: item => item.resource,
    view: item => <CheckBoxWithAsterisk
      aria-describedby="asterisk-policy-desc"
      aria-label={getCheckBoxAriaLabel('view', item.resource)}
      onChange={event => onChangeCapabilityCheckbox(event, item.id, 'view')}
      readOnly={readOnly}
      checked={item.actions.view}
    />,
    edit: item => <CheckBoxWithAsterisk
      aria-describedby="asterisk-policy-desc"
      aria-label={getCheckBoxAriaLabel('edit', item.resource)}
      onChange={event => onChangeCapabilityCheckbox(event, item.id, 'edit')}
      readOnly={readOnly}
      checked={item.actions.edit}
    />,
    manage: item => <CheckBoxWithAsterisk
      aria-describedby="asterisk-policy-desc"
      aria-label={getCheckBoxAriaLabel('manage', item.resource)}
      onChange={event => onChangeCapabilityCheckbox(event, item.id, 'manage')}
      readOnly={readOnly}
      checked={item.actions.manage}
    />,
    // policies: (item) => <Badge>{item.policiesCount}</Badge>
  };

  return <div data-testid="capabilities-settings-type" className={css.gutterTop}>
    <Headline size="large" margin="none" tag="h3">
      <FormattedMessage id="ui-authorization-roles.details.settings" />
    </Headline>
    <MultiColumnList
      interactive={false}
      columnMapping={columnMapping}
      formatter={resultsFormatter}
      contentData={content}
      visibleColumns={['application', 'resource', 'view', 'edit', 'manage', '']}
      columnWidths={{ application: '40%', resource: '36%', view: '6%', edit: '6%', manage: '6%' }}
    />
  </div>;
};

CapabilitiesSettings.propTypes = { content: capabilitiesPropType,
  readOnly: PropTypes.bool,
  onChangeCapabilityCheckbox: PropTypes.func };

export { CapabilitiesSettings };
