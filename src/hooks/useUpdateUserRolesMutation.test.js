import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { renderHook, act } from '@folio/jest-config-stripes/testing-library/react';

import { useOkapiKy } from '@folio/stripes/core';

import useUpdateUserRolesMutation from './useUpdateUserRolesMutation';

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useUpdateUserRolesMutation', () => {
  it('should make PUT request with provided capabilities list ids', async () => {
    const putMock = jest.fn().mockReturnValue({ json: () => Promise.resolve({}) });

    useOkapiKy.mockClear().mockReturnValue({
      put: putMock,
    });

    const { result } = renderHook(
      () => useUpdateUserRolesMutation(),
      { wrapper },
    );

    await act(async () => { result.current.mutateUpdateUserRoles({ userId: '123', roleIds: ['1', '2', '3']}); });

    expect(putMock).toHaveBeenCalled();
  });
});
