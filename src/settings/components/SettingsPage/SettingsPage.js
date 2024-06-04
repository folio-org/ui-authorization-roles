import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';

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

const SettingsPage = ({ path }) => {
  const { id: roleId } = useParams();

  const [searchTerm, setSearchTerm] = useState('');

  const { roles, isLoading, onSubmitSearch } = useAuthorizationRoles();

  const lastMenu = (
    <PaneMenu>
      <Button
        to={path + '/create'}
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
    updatedBy: (item) => (item.metadata?.modifiedBy || <NoValue />),
    updated: (item) => (item.metadata?.modifiedDate ? (
      <FormattedDate value={item.metadata?.modifiedDate} />
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
      {roleId && <RoleDetails roleId={roleId} path={path} />}
    </Paneset>
  );
};

SettingsPage.propTypes = {
  path: PropTypes.string.isRequired,
};

export default SettingsPage;
