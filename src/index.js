import { useIntlKeyStore } from '@k-int/stripes-kint-components';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';
import PropTypes from 'prop-types';

import {
  RoleCreate,
  RoleEdit,
} from '@folio/stripes-authorization-components';

import Settings from './settings';

const App = ({ match: { path } }) => {
  const addKey = useIntlKeyStore((state) => state.addKey);
  addKey('ui-authorization-roles');

  return (
    <Router>
      <Switch>
        <Route exact path={`${path}/create`} render={() => <RoleCreate path={path} />} />
        <Route exact path={`${path}/:id/edit`} render={() => <RoleEdit path={path} />} />
        <Route path={`${path}/:id?`} render={() => <Settings path={path} />} />
      </Switch>
    </Router>
  );
};

App.propTypes = {
  match: PropTypes.object.isRequired
};

export default App;
