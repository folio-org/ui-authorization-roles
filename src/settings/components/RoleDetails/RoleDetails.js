import React, { useContext } from 'react';
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
} from '@folio/stripes/components';

import { useHistory, useLocation } from 'react-router';
import css from '../../style.css';
import { RoleDetailsCapabilities } from '../Capabilities';
import { RoleDetailsContext } from './context/RoleDetailsContext';

const RoleDetails = ({ onClose }) => {
  const history = useHistory();
  const { pathname } = useLocation();

  /*
    Use ConnectedUserName for updatedBy and createdBy fields after Poppy release
   const ConnectedUserName = connect(UserName);
  */

  const { capabilitiesTotalCount, role } = useContext(RoleDetailsContext);

  const getActionMenu = () => (
    <>
      <Button buttonStyle="dropdownItem" onClick={() => history.push(`${pathname}?layout=edit&id=${role.id}`)}>
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
      paneTitle={role.name}
      onClose={onClose}
      dismissible
      actionMenu={getActionMenu}
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
              createdDate={role.metadata?.createdDate}
              lastUpdatedDate={role.metadata?.modifiedDate}
              lastUpdatedBy={
                role.metadata?.modifiedBy || ''
              }
              createdBy={role.metadata?.createdBy || ''}
            />
            <KeyValue
              data-testid="role-name"
              label={
                <FormattedMessage id="ui-authorization-roles.columns.name" />
              }
              value={role.name}
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
            label={<FormattedMessage id="ui-authorization-roles.details.capabilities" />}
            displayWhenClosed={
              <Badge>
                {capabilitiesTotalCount}
              </Badge>
            }
          >
            <RoleDetailsCapabilities />
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
};

export default RoleDetails;
