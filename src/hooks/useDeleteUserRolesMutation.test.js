import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { renderHook, act } from '@folio/jest-config-stripes/testing-library/react';

import { useOkapiKy } from '@folio/stripes/core';

import useDeleteUserRolesMutation from './useDeleteUserRolesMutation';

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useDeleteUserRolesMutation', () => {
  it('should make DELETE request with provided capabilities list ids', async () => {
    const deleteMock = jest.fn().mockReturnValue({ json: () => Promise.resolve({}) });

    useOkapiKy.mockClear().mockReturnValue({
      delete: deleteMock,
    });

    const { result } = renderHook(
      () => useDeleteUserRolesMutation(),
      { wrapper },
    );

    await act(async () => { result.current.mutateDeleteUserRoles({ userId: '123'}); });

    expect(deleteMock).toHaveBeenCalled();
  });
});
