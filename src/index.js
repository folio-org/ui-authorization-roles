import React from 'react';
import { useIntlKeyStore } from '@k-int/stripes-kint-components';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';
import PropTypes from 'prop-types';

import Settings from './settings';
import CreateRole from './settings/components/CreateEditRole/CreateRole';
import EditRole from './settings/components/CreateEditRole/EditRole';

const App = ({ match: { path } }) => {
  const addKey = useIntlKeyStore((state) => state.addKey);
  addKey('ui-authorization-roles');

  return (
    <Router>
      <Switch>
        <Route exact path={`${path}/create`} render={() => <CreateRole path={path} />} />
        <Route exact path={`${path}/:id/edit`} render={() => <EditRole path={path} />} />
        <Route path={`${path}/:id?`} render={() => <Settings path={path} />} />
      </Switch>
    </Router>
  );
};

App.propTypes = {
  match: PropTypes.object.isRequired
};

export default App;
