import React from 'react';
import { MultiColumnList, Headline } from '@folio/stripes/components';
import { FormattedMessage } from 'react-intl';

import PropTypes from 'prop-types';
import { CheckBoxWithAsterisk } from '../../../components/CheckBoxWithAsterisk/CheckBoxWithAsterisk';
import { getApplicationName } from '../../utils';
import { capabilitiesPropType } from '../../types';
import { columnTranslations } from '../../../constants/translations';
import { useCheckboxAriaStates } from './helpers';

const CapabilitiesDataType = ({ content, readOnly, onChangeCapabilityCheckbox }) => {
  const { getCheckBoxAriaLabel, formatMessage } = useCheckboxAriaStates();

  const columnMapping = {
    application: (
      formatMessage(columnTranslations.application)
    ),
    resource: formatMessage(columnTranslations.resource),
    view: formatMessage(columnTranslations.view),
    edit: formatMessage(columnTranslations.edit),
    create: formatMessage(columnTranslations.create),
    delete: formatMessage(columnTranslations.delete),
    manage: formatMessage(columnTranslations.manage),
    // policies: formatMessage(columnTranslations.policies)
  };

  const resultsFormatter = {
    application: (item) => getApplicationName(item.applicationId),
    resource: (item) => item.resource,
    view: (item) => (
      <CheckBoxWithAsterisk onChange={event => onChangeCapabilityCheckbox(event, item.id, 'view')} aria-describedby="asterisk-policy-desc" aria-label={getCheckBoxAriaLabel('view', item.resource)} readOnly={readOnly} checked={item.actions.view} />
    ),
    edit: (item) => (
      <CheckBoxWithAsterisk onChange={event => onChangeCapabilityCheckbox(event, item.id, 'edit')} aria-describedby="asterisk-policy-desc" aria-label={getCheckBoxAriaLabel('edit', item.resource)} readOnly={readOnly} checked={item.actions.edit} />
    ),
    create: (item) => (
      <CheckBoxWithAsterisk onChange={event => onChangeCapabilityCheckbox(event, item.id, 'create')} aria-describedby="asterisk-policy-desc" aria-label={getCheckBoxAriaLabel('create', item.resource)} readOnly={readOnly} checked={item.actions.create} />
    ),
    delete: (item) => (
      <CheckBoxWithAsterisk onChange={event => onChangeCapabilityCheckbox(event, item.id, 'delete')} aria-describedby="asterisk-policy-desc" aria-label={getCheckBoxAriaLabel('delete', item.resource)} readOnly={readOnly} checked={item.actions.delete} />
    ),
    manage: (item) => (
      <CheckBoxWithAsterisk onChange={event => onChangeCapabilityCheckbox(event, item.id, 'manage')} aria-describedby="asterisk-policy-desc" aria-label={getCheckBoxAriaLabel('manage', item.resource)} readOnly={readOnly} checked={item.actions.manage} />
    ),
    // policies: item => <Badge>{item.policiesCount}</Badge>
  };

  return (
    <div data-testid="capabilities-data-type">
      <Headline size="large" margin="none" tag="h3">
        <FormattedMessage id="ui-authorization-roles.details.data" />
      </Headline>
      <MultiColumnList
        interactive={false}
        columnMapping={columnMapping}
        formatter={resultsFormatter}
        contentData={content}
        visibleColumns={[
          'application',
          'resource',
          'view',
          'edit',
          'create',
          'delete',
          'manage',
          '',
        ]}
        columnWidths={{
          application: '40%',
          resource: '24%',
          view: '6%',
          edit: '6%',
          create: '6%',
          delete: '6%',
          manage: '6%',
        }}
      />
    </div>
  );
};

CapabilitiesDataType.propTypes = { content: capabilitiesPropType,
  readOnly: PropTypes.bool,
  onChangeCapabilityCheckbox: PropTypes.func };

export { CapabilitiesDataType };
