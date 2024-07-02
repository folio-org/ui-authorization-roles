import PropTypes from 'prop-types';
import { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useHistory } from 'react-router';

import {
  AccordionSet,
  Accordion,
  ExpandAllButton,
  AccordionStatus,
  Pane,
  Button,
  KeyValue,
  Icon,
  PaneHeader,
  Loading,
  NoValue,
  ConfirmationModal
} from '@folio/stripes/components';
import { ViewMetaData } from '@folio/stripes/smart-components';
import { useStripes } from '@folio/stripes/core';

import {
  useDeleteRoleMutation,
  useErrorCallout,
  useRoleById,
} from '../../../hooks';
import AccordionUsers from './AccordionUsers';
import AccordionCapabilities from './AccordionCapabilities';
import AccordionCapabilitySets from './AccordionCapabilitySets';

import css from '../../style.css';

const RoleDetails = ({ roleId, path }) => {
  const { connect } = useStripes();
  const intl = useIntl();
  const ConnectedViewMetaData = connect(ViewMetaData);

  const history = useHistory();
  const { sendErrorCallout } = useErrorCallout();

  const onClose = () => history.push(path);

  const { roleDetails: role } = useRoleById(roleId);
  const { mutateAsync: deleteRole } = useDeleteRoleMutation(onClose, sendErrorCallout);

  const [isDeleting, setIsDeleting] = useState(false);

  const getActionMenu = () => (
    <>
      <Button buttonStyle="dropdownItem" onClick={() => history.push(`${path}/${roleId}/edit`)}>
        <Icon icon="edit">
          <FormattedMessage id="ui-authorization-roles.crud.edit" />
        </Icon>
      </Button>
      <Button
        buttonStyle="dropdownItem"
        onClick={() => {
          setIsDeleting(true);
        }}
      >
        <Icon icon="trash">
          <FormattedMessage id="ui-authorization-roles.crud.delete" />
        </Icon>
      </Button>
    </>
  );

  return (
    <Pane
      defaultWidth="80%"
      renderHeader={renderProps => <PaneHeader
        {...renderProps}
        dismissible
        actionMenu={getActionMenu}
        paneTitle={role?.name || <Loading />}
        onClose={onClose}
      />}
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
            <ConnectedViewMetaData metadata={role?.metadata} />
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
              value={role?.description ?? <NoValue />}
            />
          </Accordion>
          <AccordionCapabilitySets roleId={roleId} />
          <AccordionCapabilities roleId={roleId} />
          <AccordionUsers roleId={roleId} />
        </AccordionSet>
      </AccordionStatus>
      <ConfirmationModal
        open={isDeleting}
        heading={intl.formatMessage({ id: 'ui-authorization-roles.crud.deleteRole' })}
        message={<FormattedMessage
          id="ui-authorization-roles.crud.deleteRoleConfirmation"
          values={{ rolename: role?.name }}
        />}
        onConfirm={() => deleteRole(roleId)}
        onCancel={() => { setIsDeleting(false); }}
        confirmLabel={<FormattedMessage id="ui-authorization-roles.crud.delete" />}
      />
    </Pane>
  );
};

RoleDetails.propTypes = {
  roleId: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired
};

export default RoleDetails;
