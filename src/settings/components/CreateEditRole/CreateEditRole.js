import React, { useEffect, useMemo, useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import { FormattedMessage } from 'react-intl';
import { Pluggable, useOkapiKy } from '@folio/stripes/core';

import {
  Paneset,
  Pane,
  PaneFooter,
  Button,
  TextField,
  TextArea,
  Layer,
  AccordionStatus,
  AccordionSet,
  Accordion,
  ExpandAllButton,
} from '@folio/stripes/components';
import PropTypes from 'prop-types';

import css from '../../style.css';
import { CapabilitiesSection } from '../Capabilities/CapabilitiesSection';
import { getKeyBasedArrayGroup } from '../../utils';
import useCapabilities from '../../../hooks/useCapabilities';
import useRoleCapabilities from '../../../hooks/useRoleCapabilities';

const CreateEditRole = ({ refetch, selectedRole }) => {
  const ky = useOkapiKy();

  const history = useHistory();
  const { pathname } = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const [roleName, setRoleName] = useState('');
  const [description, setDescription] = useState('');

  const { capabilitiesList } = useCapabilities();
  const { initialRoleCapabilitiesSelectedMap, isSuccess: isRoleCapabilitiesFetched } = useRoleCapabilities(selectedRole?.id);
  const [selectedCapabilitiesMap, setSelectedCapabilitiesMap] = useState({});

  useEffect(() => {
    if (isRoleCapabilitiesFetched && selectedRole) {
      setSelectedCapabilitiesMap(initialRoleCapabilitiesSelectedMap);
    }
    /* isRoleCapabilitiesFetched is enough to know if initialCapabilitiesSelectedMap fetched and can be settled safely to local state */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRoleCapabilitiesFetched, selectedRole]);

  const onChangeCapabilityCheckbox = (event, id) => {
    setSelectedCapabilitiesMap({ ...selectedCapabilitiesMap, [id]: event.target.checked });
  };

  const groupedCapabilitiesByType = useMemo(() => {
    return getKeyBasedArrayGroup(capabilitiesList, 'type');
  }, [capabilitiesList]);

  const defineCrudOperationTitleId = () => (selectedRole ? 'ui-authorization-roles.crud.editRole' : 'ui-authorization-roles.crud.createRole');

  const isCapabilitySelected = (id) => selectedCapabilitiesMap[id];

  useEffect(() => {
    if (selectedRole) {
      setRoleName(selectedRole.name);
      setDescription(selectedRole.description);
    }
  }, [selectedRole]);

  const goBack = () => history.push(pathname);

  const refetchAndGoBack = () => {
    refetch();
    goBack();
  };

  const onEditRole = async (role) => {
    try {
      const res = await ky.put(`roles/${role.id}`, { json: { name:roleName, description } });
      if (res.ok) {
        refetchAndGoBack();
      }
    } catch (err) {
      throw new Error(JSON.stringify(err));
    }
  };

  const onCreateRole = async () => {
    try {
      const res = await ky.post('roles', { json: { name:roleName, description } });
      if (res.ok) {
        refetchAndGoBack();
      }
    } catch (err) {
      throw new Error(JSON.stringify(err));
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    if (selectedRole) {
      await onEditRole(selectedRole);
    } else {
      await onCreateRole();
    }
    setIsLoading(false);
  };

  const paneFooterRenderStart = <Button
    marginBottom0
    buttonStyle="default mega"
    onClick={goBack}
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
    <Layer isOpen inRootSet contentLabel={<FormattedMessage id={defineCrudOperationTitleId()} />}>
      <Paneset isRoot>
        <Pane
          onClose={goBack}
          centerContent
          dismissible
          paneTitle={<FormattedMessage id={defineCrudOperationTitleId()} />}
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
                  capabilities={groupedCapabilitiesByType}
                />
              </Accordion>
            </AccordionSet>
          </AccordionStatus>
        </Pane>
      </Paneset>;
    </Layer>;
  </form>;
};

CreateEditRole.propTypes = {
  refetch: PropTypes.func.isRequired,
  selectedRole: PropTypes.object
};

export default CreateEditRole;
