import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { MultiColumnList, Headline } from '@folio/stripes/components';
import { getApplicationName } from '../../utils';
import { CheckBoxWithAsterisk } from '../../../components/CheckBoxWithAsterisk/CheckBoxWithAsterisk';
import { capabilitiesPropType } from '../../types';
import { columnTranslations } from '../../../constants/translations';
import { useCheckboxAriaStates } from './helpers';

import css from '../../style.css';

const CapabilitiesProcedural = ({ content, readOnly, onChangeCapabilityCheckbox }) => {
  const { getCheckBoxAriaLabel, formatMessage } = useCheckboxAriaStates();

  const columnMapping = {
    application: formatMessage(columnTranslations.application),
    resource:formatMessage(columnTranslations.settings),
    execute: formatMessage(columnTranslations.execute),
    // policies: formatMessage(columnTranslations.policies)
  };

  const resultsFormatter = {
    application: item => getApplicationName(item.applicationId),
    resource:item => item.resource,
    execute: item => <CheckBoxWithAsterisk
      aria-describedby="asterisk-policy-desc"
      aria-label={getCheckBoxAriaLabel('execute', item.resource)}
      onChange={event => onChangeCapabilityCheckbox(event, item.id, 'execute')}
      readOnly={readOnly}
      checked={item.actions.execute}
    />,
    // policies: (item) => <Badge>{item.policiesCount}</Badge>
  };

  return <div data-testid="capabilities-procedural-type" className={css.gutterTop}>
    <Headline size="large" margin="none" tag="h3">
      <FormattedMessage id="ui-authorization-roles.details.procedural" />
    </Headline>
    <MultiColumnList
      interactive={false}
      columnMapping={columnMapping}
      formatter={resultsFormatter}
      contentData={content}
      visibleColumns={['application', 'resource', 'execute', '']}
      columnWidths={{ application: '40%', resource: '48%', execute: '6%' }}
    />
  </div>;
};

CapabilitiesProcedural.propTypes = { content: capabilitiesPropType,
  readOnly: PropTypes.bool,
  onChangeCapabilityCheckbox: PropTypes.func };

export { CapabilitiesProcedural };
