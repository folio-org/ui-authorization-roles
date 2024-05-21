import { useContext } from 'react';
import { CalloutContext } from '@folio/stripes/core';

const useErrorCallout = () => {
  const callout = useContext(CalloutContext);

  return {
    sendErrorCallout: (message) => {
      callout.sendCallout({ type: 'error', message, timeout: 0 });
    }
  };
};

export default useErrorCallout;
