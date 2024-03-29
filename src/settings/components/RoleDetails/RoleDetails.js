import { useState } from 'react';
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
  Icon,
  PaneHeader,
  Loading,
  NoValue,
  ConfirmationModal
} from '@folio/stripes/components';

import { useHistory, useLocation } from 'react-router';
import css from '../../style.css';
import useRoleById from '../../../hooks/useRoleById';
import AccordionUsers from './AccordionUsers';
import AccordionCapabilities from './AccordionCapabilities';
import AccordionCapabilitySets from './AccordionCapabilitySets';
import useDeleteRoleMutation from '../../../hooks/useDeleteRoleMutation';

const RoleDetails = ({ onClose, roleId }) => {
  const history = useHistory();
  const { pathname } = useLocation();

  const { roleDetails: role } = useRoleById(roleId);
  const { mutateAsync: deleteRole } = useDeleteRoleMutation(onClose);

  const [isDeleting, setIsDeleting] = useState(false);

  const getActionMenu = () => (
    <>
      <Button buttonStyle="dropdownItem" onClick={() => history.push(`${pathname}?layout=edit&id=${roleId}`)}>
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
        heading={<FormattedMessage id="ui-authorization-roles.crud.deleteRole" />}
        message={<FormattedMessage id="ui-authorization-roles.crud.deleteRoleConfirmation" values={{ rolename: role?.name }} />}
        onConfirm={() => deleteRole(roleId)}
        onCancel={() => { setIsDeleting(false); }}
        confirmLabel={<FormattedMessage id="ui-authorization-roles.crud.delete" />}
      />
    </Pane>
  );
};

RoleDetails.propTypes = {
  onClose: PropTypes.func.isRequired,
  roleId: PropTypes.string.isRequired
};

export default RoleDetails;
