import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import { FormattedMessage, FormattedDate } from 'react-intl';

import {
  Pane,
  PaneHeader,
  Paneset,
  Button,
  PaneMenu,
  MultiColumnList,
  TextLink,
  NoValue,
} from '@folio/stripes/components';
import { getFullName } from '@folio/stripes/util';

import {
  RoleDetails,
  SearchForm,
  useAuthorizationRoles,
  useAuthorizationRolesMutation,
  useRoleById,
  useShowCallout,
  useUsers,
} from '@folio/stripes-authorization-components';

const SettingsPage = ({ path }) => {
  const history = useHistory();
  const { id: roleId } = useParams();
  const showCallout = useShowCallout();

  const [searchTerm, setSearchTerm] = useState('');

  const { roles, isLoading, onSubmitSearch } = useAuthorizationRoles();

  const updatedByUserIds = useMemo(() => roles.map(i => i?.metadata.updatedByUserId), [roles]);
  const { users } = useUsers(updatedByUserIds);

  const {
    duplicateAuthorizationRole,
    isLoading: isDuplicating,
  } = useAuthorizationRolesMutation();

  const { roleDetails } = useRoleById(roleId);

  const onDuplicate = () => {
    const roleName = roleDetails?.name;
    const messageIdPrefix = 'ui-authorization-roles.authorizationsRoles.duplicate';

    duplicateAuthorizationRole(roleId)
      .then(({ id }) => {
        history.push(`${path}/${id}`);

        showCallout({
          messageId: `${messageIdPrefix}.success`,
          type: 'success',
          values: { name: roleName },
        });
      }).catch(() => {
        showCallout({
          messageId: `${messageIdPrefix}.error`,
          type: 'error',
          values: { name: roleName },
        });
      });
  };

  const lastMenu = (
    <PaneMenu>
      <Button
        to={`${path}/create`}
        buttonStyle="primary"
        marginBottom0
      >
        + <FormattedMessage id="ui-authorization-roles.new" />
      </Button>
    </PaneMenu>
  );

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    onSubmitSearch(searchTerm);
  };

  const resultsFormatter = {
    name: (item) => <TextLink to={`${path}/${item.id}`}>{item.name}</TextLink>,
    updatedBy: (item) => (item.metadata.updatedByUserId ? getFullName(users[item.metadata.updatedByUserId]) : <NoValue />),
    updated: (item) => (item.metadata?.updatedDate ? (
      <FormattedDate value={item.metadata?.updatedDate} />
    ) : (
      <NoValue />
    )),
  };

  return (
    <Paneset>
      <Pane
        defaultWidth="100"
        fluidContentWidth
        renderHeader={() => (
          <PaneHeader
            lastMenu={lastMenu}
            paneTitle={
              <FormattedMessage id="ui-authorization-roles.meta.title" />
            }
          />
        )}
      >
        <SearchForm
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onSubmit={handleSearchSubmit}
        />
        <MultiColumnList
          columnMapping={{
            name: <FormattedMessage id="ui-authorization-roles.columns.name" />,
            description: (
              <FormattedMessage id="ui-authorization-roles.columns.description" />
            ),
            updated: (
              <FormattedMessage id="ui-authorization-roles.columns.updatedDate" />
            ),
            updatedBy: (
              <FormattedMessage id="ui-authorization-roles.columns.updatedBy" />
            ),
          }}
          contentData={roles}
          formatter={resultsFormatter}
          loading={isLoading}
          visibleColumns={['name', 'description', 'updated', 'updatedBy']}
        />
      </Pane>
      {roleId && (
        <RoleDetails
          isLoading={isDuplicating}
          onDuplicate={onDuplicate}
          path={path}
          roleId={roleId}
        />
      )}
    </Paneset>
  );
};

SettingsPage.propTypes = {
  path: PropTypes.string.isRequired,
};

export default SettingsPage;
