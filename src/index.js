import React from 'react';
import { useIntlKeyStore } from '@k-int/stripes-kint-components';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';

import Settings from './settings';
import CreateRole from './settings/components/CreateEditRole/CreateRole';
import EditRole from './settings/components/CreateEditRole/EditRole';

const baseUrl = '/settings/authorization-roles';

const App = () => {
  const addKey = useIntlKeyStore((state) => state.addKey);
  addKey('ui-authorization-roles');

  return <Router basename={baseUrl}>
    <Switch>
      <Route exact path="/create" component={CreateRole} />
      <Route exact path="/:id/edit" component={EditRole} />
      <Route path="/:id" component={Settings} />
      <Route path="/" component={Settings} />
    </Switch>
  </Router>;
};

export default App;
