import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { renderHook, act } from '@folio/jest-config-stripes/testing-library/react';

import { useOkapiKy } from '@folio/stripes/core';

import useCreateRoleMutation from './useCreateRoleMutation';

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useCreateRoleMutation', () => {
  it('should make post request with provided capabilities list ids', async () => {
    const postMock = jest.fn().mockReturnValue({ json: () => Promise.resolve({}) });

    useOkapiKy.mockClear().mockReturnValue({
      post: postMock,
    });

    const { result } = renderHook(
      () => useCreateRoleMutation(['1', '2', '3'], []),
      { wrapper },
    );

    await act(async () => { result.current.mutateRole(); });

    expect(postMock).toHaveBeenCalled();
  });
});
