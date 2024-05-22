import React from 'react';
import { useIntlKeyStore } from '@k-int/stripes-kint-components';
import { Switch, Route } from 'react-router-dom';

import Settings from './settings';

const baseUrl = '/settings/authorization-roles';

const App = () => {
  const addKey = useIntlKeyStore((state) => state.addKey);
  addKey('ui-authorization-roles');

  return <Switch>
    <Route path={`${baseUrl}/:id?`} component={Settings} />
  </Switch>;
};

export default App;
