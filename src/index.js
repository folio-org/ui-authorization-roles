import { useIntlKeyStore } from '@k-int/stripes-kint-components';

import Settings from './settings';

const App = () => {
  const addKey = useIntlKeyStore((state) => state.addKey);
  addKey('ui-authorization-roles');


  return <Settings />;
};

export default App;
