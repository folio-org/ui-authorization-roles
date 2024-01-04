import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';

import { MultiColumnList, Headline } from '@folio/stripes/components';
import { getApplicationName } from '../../utils';
import { capabilitiesPropType } from '../../types';
import { columnTranslations } from '../../../constants/translations';

import css from '../../style.css';
import ItemActionCheckbox from './ItemActionCheckbox';

const CapabilitiesProcedural = ({ content, readOnly, onChangeCapabilityCheckbox, isCapabilitySelected }) => {
  const { formatMessage } = useIntl();

  const columnMapping = {
    application: formatMessage(columnTranslations.application),
    resource:formatMessage(columnTranslations.settings),
    execute: formatMessage(columnTranslations.execute),
    // policies: formatMessage(columnTranslations.policies)
  };

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
    application: item => getApplicationName(item.applicationId),
    resource:item => item.resource,
    execute: item => renderItemActionCheckbox(item, 'execute'),
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
  onChangeCapabilityCheckbox: PropTypes.func,
  isCapabilitySelected: PropTypes.func };

export { CapabilitiesProcedural };
