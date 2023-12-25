import React from 'react';

import { FormattedMessage } from 'react-intl';
import {
  Accordion,
  AccordionSet,
  AccordionStatus, Button,
  ExpandAllButton,
  Layer,
  Pane,
  PaneFooter,
  Paneset, TextArea, TextField
} from '@folio/stripes/components';
import { Pluggable } from '@folio/stripes/core';

import PropTypes from 'prop-types';
import { CapabilitiesSection } from '../Capabilities/CapabilitiesSection';
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
  ><FormattedMessage id="ui-authorization-roles.crud.saveAndClose" /></Button>;

  return <form onSubmit={onSubmit} data-testid="create-role-form">
    <Layer isOpen inRootSet contentLabel={<FormattedMessage id={title} />}>
      <Paneset isRoot>
        <Pane
          onClose={onClose}
          centerContent
          dismissible
          paneTitle={<FormattedMessage id={title} />}
          defaultWidth="100%"
          footer={<PaneFooter
            renderStart={paneFooterRenderStart}
            renderEnd={paneFooterRenderEnd}
          />}
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
              <Accordion
                label={<FormattedMessage id="ui-authorization-roles.details.capabilities" />}
                displayWhenOpen={
                  <Pluggable type="select-application" renderTrigger={props => <Button icon="plus-sign" {...props}><FormattedMessage id="ui-authorization-roles.crud.addApplication" /></Button>} />
                }
              >
                <CapabilitiesSection
                  readOnly={false}
                  isCapabilitySelected={isCapabilitySelected}
                  onChangeCapabilityCheckbox={onChangeCapabilityCheckbox}
                  capabilities={capabilities}
                  roleCapabilitiesListIds={selectedCapabilitiesMap}
                />
              </Accordion>
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
  onChangeCapabilityCheckbox: PropTypes.func,
  capabilities: PropTypes.object,
  isLoading: PropTypes.bool,
  selectedCapabilitiesMap : PropTypes.object
};

export default CreateEditRoleForm;
