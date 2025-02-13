import { useIntlKeyStore } from '@k-int/stripes-kint-components';
import { Switch, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import { IfPermission } from '@folio/stripes/core';

import {
  RoleCreate,
  RoleEdit,
} from '@folio/stripes-authorization-components';

import Settings from './settings';

const App = ({ match: { path } }) => {
  const addKey = useIntlKeyStore((state) => state.addKey);
  addKey('ui-authorization-roles');

  return (
    <Switch>
      <Route
        exact
        path={`${path}/create`}
        render={() => <IfPermission perm="ui-authorization-roles.settings.create">
          <RoleCreate path={path} />
        </IfPermission>
          }
      />
      <Route
        exact
        path={`${path}/:id/edit`}
        render={() => <IfPermission perm="ui-authorization-roles.settings.edit">
          <RoleEdit path={path} />
        </IfPermission>}
      />
      <Route path={`${path}/:id?`} render={() => <Settings path={path} />} />
    </Switch>
  );
};

App.propTypes = {
  match: PropTypes.object.isRequired
};

export default App;
