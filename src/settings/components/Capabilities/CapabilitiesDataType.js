import React from 'react';
import { MultiColumnList, Headline } from '@folio/stripes/components';
import { FormattedMessage, useIntl } from 'react-intl';

import PropTypes from 'prop-types';
import { getApplicationName } from '../../utils';
import { capabilitiesPropType } from '../../types';
import { columnTranslations } from '../../../constants/translations';
import ItemActionCheckbox from './ItemActionCheckbox';

const CapabilitiesDataType = ({ content, readOnly, onChangeCapabilityCheckbox, isCapabilitySelected }) => {
  const { formatMessage } = useIntl();

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

  /**
   * Renders an action checkbox for an item.
   *
   * @param {Object} item - The capability item object.
   * @param {string} action - The action to render checkbox for action(e.g. 'view').
   * @return {JSX.Element} By requirements on non-readonly mode we should hide the checkboxes on
   * not related actions. Since every capability have only one action
   * (e.g. {...capability, action: 'view'}),
   * show only checkbox for that particular action.
   * If readOnly mode we should show the checkbox for all actions.
   */
  const renderItemActionCheckbox = (item, action) => {
    return <ItemActionCheckbox
      action={action}
      readOnly={readOnly}
      onChangeCapabilityCheckbox={onChangeCapabilityCheckbox}
      item={item}
      isCapabilitySelected={isCapabilitySelected}
    />;
  };

  const resultsFormatter = {
    application: (item) => getApplicationName(item.applicationId),
    resource: (item) => item.resource,
    view: (item) => renderItemActionCheckbox(item, 'view'),
    edit: (item) => renderItemActionCheckbox(item, 'edit'),
    create: (item) => renderItemActionCheckbox(item, 'create'),
    delete: (item) => renderItemActionCheckbox(item, 'delete'),
    manage: (item) => renderItemActionCheckbox(item, 'manage'),
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
  onChangeCapabilityCheckbox: PropTypes.func,
  isCapabilitySelected: PropTypes.func };

export { CapabilitiesDataType };
