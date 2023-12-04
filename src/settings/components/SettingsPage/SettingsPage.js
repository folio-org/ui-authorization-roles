import React, { useState } from 'react';

import { useHistory, useLocation } from 'react-router';

import { FormattedMessage, FormattedDate } from 'react-intl';

import {
  Pane,
  PaneHeader,
  Paneset,
  Button,
  PaneMenu,
  MultiColumnList,
  TextLink,
} from '@folio/stripes/components';

import useCapabilities from '../../../hooks/useCapabilities';
import useAuthorizationRoles from '../../../hooks/useAuthorizationRoles';
import { SearchForm } from '../SearchForm';
import { RoleDetails } from '../RoleDetails';
import { RoleDetailsContextProvider } from '../RoleDetails/context/RoleDetailsContext';
import { CreateEditRole } from '../CreateEditRole';

const SettingsPage = () => {
  const history = useHistory();
  const { pathname } = useLocation();

  const queryParams = new URLSearchParams(history.location.search);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRow, setSelectedRow] = useState(null);

  const { data: capabilitiesList } = useCapabilities();

  const onRowClick = (_event, row) => setSelectedRow(row);

  const lastMenu = (
    <PaneMenu>
      <Button buttonStyle="primary" marginBottom0 onClick={() => history.push(`${pathname}?layout=add`)}>
        + <FormattedMessage id="ui-authorization-roles.new" />
      </Button>
    </PaneMenu>
  );

  const { roles, isLoading, refetch } = useAuthorizationRoles({ searchTerm });

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    refetch();
  };

  const resultsFormatter = {
    name: (item) => <TextLink>{item.name}</TextLink>,
    updatedBy: (item) => (item.metadata?.modifiedBy || ''),
    updated: (item) => (item.metadata?.modifiedDate ? (
      <FormattedDate value={item.metadata?.modifiedDate} />
    ) : (
      '-'
    )),
  };

  if (queryParams.get('layout') === 'add') {
    return <CreateEditRole refetch={refetch} />;
  }

  if (queryParams.get('layout') === 'edit' && queryParams.get('id') === selectedRow?.id) {
    return <CreateEditRole refetch={refetch} selectedRole={selectedRow} />;
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
          selectedRow={selectedRow}
          loading={isLoading}
          visibleColumns={['name', 'description', 'updated', 'updatedBy']}
          onRowClick={onRowClick}
        />
      </Pane>

      {selectedRow && (
        <RoleDetailsContextProvider capabilitiesList={capabilitiesList} role={selectedRow}>
          <RoleDetails onClose={() => setSelectedRow(null)} />
        </RoleDetailsContextProvider>
      )}
    </Paneset>
  );
};

export default SettingsPage;