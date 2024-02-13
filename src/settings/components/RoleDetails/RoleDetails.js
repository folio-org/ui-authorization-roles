import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  AccordionSet,
  Accordion,
  ExpandAllButton,
  AccordionStatus,
  Pane,
  Button,
  KeyValue,
  MetaSection,
  Badge,
  Icon,
  PaneHeader,
  Loading,
} from '@folio/stripes/components';

import { useHistory, useLocation } from 'react-router';
import css from '../../style.css';
import { CapabilitiesSection } from '../Capabilities/CapabilitiesSection';
import useRoleCapabilities from '../../../hooks/useRoleCapabilities';
import useRoleById from '../../../hooks/useRoleById';
import useRoleCapabilitySets from '../../../hooks/useRoleCapabilitySets';

const RoleDetails = ({ onClose, roleId }) => {
  const history = useHistory();
  const { pathname } = useLocation();

  const { roleDetails: role } = useRoleById(roleId);

  const { groupedRoleCapabilitySetsByType, capabilitySetsTotalCount, initialRoleCapabilitySetsSelectedMap } = useRoleCapabilitySets(roleId);

  /*
    Use ConnectedUserName for updatedBy and createdBy fields after Poppy release
   const ConnectedUserName = connect(UserName);
  */

  const isCapabilitySetSelected = (capabilitySetId) => !!initialRoleCapabilitySetsSelectedMap[capabilitySetId];

  const { capabilitiesTotalCount, initialRoleCapabilitiesSelectedMap, groupedRoleCapabilitiesByType } = useRoleCapabilities(roleId);

  const isCapabilitySelected = (capabilityId) => !!initialRoleCapabilitiesSelectedMap[capabilityId];

  const getActionMenu = () => (
    <>
      <Button buttonStyle="dropdownItem" onClick={() => history.push(`${pathname}?layout=edit&id=${roleId}`)}>
        <Icon icon="edit">
          <FormattedMessage id="ui-authorization-roles.crud.edit" />
        </Icon>
      </Button>
      <Button buttonStyle="dropdownItem">
        <Icon icon="trash">
          <FormattedMessage id="ui-authorization-roles.crud.delete" />
        </Icon>
      </Button>
    </>
  );

  return (
    <Pane
      defaultWidth="80%"
      renderHeader={renderProps => <PaneHeader {...renderProps} dismissible actionMenu={getActionMenu} paneTitle={role?.name || <Loading />} onClose={onClose} />}
    >
      <AccordionStatus>
        <div className={css.alignRightWrapper}>
          <ExpandAllButton />
        </div>
        <AccordionSet>
          <Accordion
            label={
              <FormattedMessage id="ui-authorization-roles.generalInformation" />
            }
          >
            <MetaSection
              id="roleMetadataId"
              contentId="roleMetadata"
              headingLevel={4}
              createdDate={role?.metadata?.createdDate}
              lastUpdatedDate={role?.metadata?.modifiedDate}
              lastUpdatedBy={
                role?.metadata?.modifiedBy || ''
              }
              createdBy={role?.metadata?.createdBy || ''}
            />
            <KeyValue
              data-testid="role-name"
              label={
                <FormattedMessage id="ui-authorization-roles.columns.name" />
              }
              value={role?.name}
            />
            <KeyValue
              data-testid="role-description"
              label={
                <FormattedMessage id="ui-authorization-roles.columns.description" />
              }
              value={role?.description ?? '-'}
            />
          </Accordion>
          <Accordion
            closedByDefault
            label={<FormattedMessage id="ui-authorization-roles.details.capabilitySets" />}
            displayWhenClosed={
              <Badge>
                {capabilitySetsTotalCount}
              </Badge>
            }
          >
            <CapabilitiesSection isCapabilitySelected={isCapabilitySetSelected} capabilities={groupedRoleCapabilitySetsByType} readOnly />
          </Accordion>
          <Accordion
            closedByDefault
            label={<FormattedMessage id="ui-authorization-roles.details.capabilities" />}
            displayWhenClosed={
              <Badge>
                {capabilitiesTotalCount}
              </Badge>
            }
          >
            <CapabilitiesSection isCapabilitySelected={isCapabilitySelected} capabilities={groupedRoleCapabilitiesByType} readOnly />
          </Accordion>
          <Accordion
            label={
              <FormattedMessage id="ui-authorization-roles.assignedUsers" />
            }
            displayWhenOpen={
              <Button icon="plus-sign">
                <FormattedMessage id="ui-authorization-roles.assignUnassign" />
              </Button>
            }
          >
            {/* To prevent empty children prop console errors */}
            <></>
          </Accordion>
        </AccordionSet>
      </AccordionStatus>
    </Pane>
  );
};

RoleDetails.propTypes = {
  onClose: PropTypes.func.isRequired,
  roleId: PropTypes.string.isRequired
};

export default RoleDetails;
