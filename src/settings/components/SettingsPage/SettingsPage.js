import React, { useState } from 'react';

import { useHistory } from 'react-router';

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

import useAuthorizationRoles from '../../../hooks/useAuthorizationRoles';
import { SearchForm } from '../SearchForm';
import { RoleDetails } from '../RoleDetails';
import EditRole from '../CreateEditRole/EditRole';
import CreateRole from '../CreateEditRole/CreateRole';
import useMatchPath from '../../../hooks/useMatchPath';

const baseUrl = '/settings/authorization-roles';

const SettingsPage = () => {
  const history = useHistory();
  const { getParams } = useMatchPath();

  const queryParams = new URLSearchParams(history.location.search);

  const [searchTerm, setSearchTerm] = useState('');
  const roleId = getParams(`${baseUrl}/:roleId`)?.roleId || '';

  const lastMenu = (
    <PaneMenu>
      <Button buttonStyle="primary" marginBottom0 onClick={() => history.push(`${baseUrl}/${roleId}?layout=add`)}>
        + <FormattedMessage id="ui-authorization-roles.new" />
      </Button>
    </PaneMenu>
  );

  const { roles, isLoading, onSubmitSearch } = useAuthorizationRoles();

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    onSubmitSearch(searchTerm);
  };

  const resultsFormatter = {
    name: (item) => <TextLink to={`${baseUrl}/${item.id}`}>{item.name}</TextLink>,
    updatedBy: (item) => (item.metadata?.modifiedBy || <NoValue />),
    updated: (item) => (item.metadata?.modifiedDate ? (
      <FormattedDate value={item.metadata?.modifiedDate} />
    ) : (
      <NoValue />
    )),
  };

  if (queryParams.get('layout') === 'add') {
    return <CreateRole />;
  }

  if (roleId && queryParams.get('layout') === 'edit') {
    return <EditRole roleId={roleId} />;
  }

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
      {roleId && <RoleDetails roleId={roleId} onClose={() => history.push(baseUrl)} />}
    </Paneset>
  );
};

export default SettingsPage;
