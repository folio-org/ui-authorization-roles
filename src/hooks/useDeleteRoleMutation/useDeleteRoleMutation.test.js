import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { renderHook, act } from '@folio/jest-config-stripes/testing-library/react';

import { useOkapiKy } from '@folio/stripes/core';

import useDeleteRoleMutation from './useDeleteRoleMutation';

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useDeleteRoleMutation', () => {
  it('should make DELETE role request with provided role id', async () => {
    const deleteMock = jest.fn().mockReturnValue({ json: () => Promise.resolve({}) });

    useOkapiKy.mockClear().mockReturnValue({
      delete: deleteMock,
    });

    const { result } = renderHook(
      () => useDeleteRoleMutation(() => {}),
      { wrapper },
    );

    await act(async () => { result.current.mutateAsync('123'); });

    expect(deleteMock).toHaveBeenCalled();
  });
});
