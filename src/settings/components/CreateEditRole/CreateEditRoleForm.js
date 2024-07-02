import React from 'react';

import { FormattedMessage, useIntl } from 'react-intl';
import {
  Accordion,
  AccordionSet,
  AccordionStatus, Button,
  ExpandAllButton,
  Layer,
  Pane,
  PaneFooter,
  PaneHeader,
  Paneset,
  TextArea,
  TextField
} from '@folio/stripes/components';
import {
  CapabilitiesAccordion,
  CapabilitiesSetsAccordion,
} from '@folio/stripes-authorization-components';

import PropTypes from 'prop-types';
import css from '../../style.css';

function CreateEditRoleForm({
  title,
  roleName,
  description,
  capabilities,
  isCapabilitySelected,
  isLoading,
  setRoleName,
  setDescription,
  onSubmit,
  onClose,
  onChangeCapabilityCheckbox,
  selectedCapabilitiesMap,
  onSaveSelectedApplications,
  checkedAppIdsMap,
  capabilitySets,
  isCapabilitySetSelected,
  onChangeCapabilitySetCheckbox,
  isCapabilityDisabled,
  isCapabilitiesLoading,
  isCapabilitySetsLoading
}) {
  const paneFooterRenderStart = <Button
    marginBottom0
    buttonStyle="default mega"
    onClick={onClose}
  ><FormattedMessage id="ui-authorization-roles.crud.cancel" />
  </Button>;

  const paneFooterRenderEnd = <Button
    marginBottom0
    buttonStyle="primary mega"
    disabled={!roleName || isLoading}
    type="submit"
    onClick={onSubmit}
  ><FormattedMessage id="stripes-components.saveAndClose" /></Button>;

  const intl = useIntl();

  return <form onSubmit={onSubmit} data-testid="create-role-form">
    <Layer isOpen inRootSet contentLabel={intl.formatMessage({ id: title })}>
      <Paneset isRoot>
        <Pane
          centerContent
          defaultWidth="100%"
          footer={<PaneFooter
            renderStart={paneFooterRenderStart}
            renderEnd={paneFooterRenderEnd}
          />}
          renderHeader={renderProps => <PaneHeader {...renderProps} paneTitle={intl.formatMessage({ id: title })} dismissible onClose={onClose} />}
        >
          <AccordionStatus>
            <div className={css.alignRightWrapper}>
              <ExpandAllButton />
            </div>
            <AccordionSet>
              <Accordion label={<FormattedMessage id="ui-authorization-roles.generalInformation" />}>
                <TextField
                  required
                  value={roleName}
                  label={<FormattedMessage id="ui-authorization-roles.form.labels.name" />}
                  onChange={event => setRoleName(event.target.value)}
                  data-testid="rolename-input"
                />
                <TextArea
                  value={description}
                  onChange={event => setDescription(event.target.value)}
                  label={<FormattedMessage id="ui-authorization-roles.form.labels.description" />}
                  data-testid="description-input"
                />
              </Accordion>

              <CapabilitiesSetsAccordion
                isCapabilitySetSelected={isCapabilitySetSelected}
                onChangeCapabilitySetCheckbox={onChangeCapabilitySetCheckbox}
                capabilitySets={capabilitySets}
                isLoading={isCapabilitySetsLoading}
              />
              <CapabilitiesAccordion
                checkedAppIdsMap={checkedAppIdsMap}
                onSaveSelectedApplications={onSaveSelectedApplications}
                isCapabilitySelected={isCapabilitySelected}
                onChangeCapabilityCheckbox={onChangeCapabilityCheckbox}
                selectedCapabilitiesMap={selectedCapabilitiesMap}
                isCapabilityDisabled={isCapabilityDisabled}
                capabilities={capabilities}
                isLoading={isCapabilitiesLoading}
              />
            </AccordionSet>
          </AccordionStatus>
        </Pane>
      </Paneset>;
    </Layer>;
  </form>;
}

CreateEditRoleForm.propTypes = {
  onSubmit: PropTypes.func,
  onClose: PropTypes.func,
  title: PropTypes.string,
  roleName: PropTypes.string,
  setRoleName: PropTypes.func,
  description: PropTypes.string,
  setDescription: PropTypes.func,
  isCapabilitySelected: PropTypes.func,
  isCapabilitySetSelected: PropTypes.func,
  onChangeCapabilityCheckbox: PropTypes.func,
  capabilities: PropTypes.object,
  capabilitySets: PropTypes.object,
  isLoading: PropTypes.bool,
  selectedCapabilitiesMap : PropTypes.object,
  onSaveSelectedApplications: PropTypes.func,
  onChangeCapabilitySetCheckbox: PropTypes.func,
  isCapabilityDisabled:PropTypes.func,
  checkedAppIdsMap:PropTypes.object,
  isCapabilitiesLoading: PropTypes.bool,
  isCapabilitySetsLoading: PropTypes.bool
};

export default CreateEditRoleForm;
