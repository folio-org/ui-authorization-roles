import { renderHook, act } from '@folio/jest-config-stripes/testing-library/react';

import { CalloutContext } from '@folio/stripes/core';

import useErrorCallout from './useErrorCallout';

const sendCallout = jest.fn();

const wrapper = ({ children }) => (
  <CalloutContext.Provider value={{ sendCallout }}>
    {children}
  </CalloutContext.Provider>
);

describe('useErrorCallout', () => {
  it('sends a callout', async () => {
    const message = 'some message';
    const { result } = renderHook(
      () => useErrorCallout(),
      { wrapper },
    );

    await act(async () => { result.current.sendErrorCallout(message); });

    expect(sendCallout).toHaveBeenCalledWith(expect.objectContaining({
      type: 'error',
      timeout: 0,
      message
    }));
  });
});
