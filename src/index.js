import React, { Suspense } from 'react';
import { useIntlKeyStore } from '@k-int/stripes-kint-components';

import { Loading } from '@folio/stripes/components';
import Settings from './settings';

const App = () => {
  const addKey = useIntlKeyStore((state) => state.addKey);
  addKey('ui-authorization-roles');


  return <Suspense fallback={<Loading />}>
    <Settings />
  </Suspense>;
};

export default App;
