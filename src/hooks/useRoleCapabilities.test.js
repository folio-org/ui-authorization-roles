import { QueryClient, QueryClientProvider } from 'react-query';
import { act, renderHook } from '@folio/jest-config-stripes/testing-library/react';

import { useOkapiKy } from '@folio/stripes/core';

import useRoleCapabilities from './useRoleCapabilities';

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const data = {
  'totalRecords': 2,
  'capabilities': [
    {
      'id': 'c11e07f4-8bb0-45d1-a396-aaa72ae3121b',
      'metadata': {
        'createdBy': 'a7189e80-0d88-4b65-9ad6-fceb4318107e',
        'createdDate': '2023-09-04T12:00:00.000+00:00'
      }
    },
    {
      'id': 'd928eab1-1d3a-4d67-949e-a0305ced5b6a',
      'metadata': {
        'createdBy': 'a7189e80-0d88-4b65-9ad6-fceb4318107e',
        'createdDate': '2023-09-04T12:00:00.000+00:00'
      }
    }
  ]
};

const expectedInitialRoleCapabilitiesSelectedMap = {
  'c11e07f4-8bb0-45d1-a396-aaa72ae3121b': true,
  'd928eab1-1d3a-4d67-949e-a0305ced5b6a': true
};
describe('useRoleById', () => {
  const mockGet = jest.fn(() => ({
    json: () => Promise.resolve(data),
  }));

  beforeEach(() => {
    queryClient.clear();
    mockGet.mockClear();
    useOkapiKy.mockClear().mockReturnValue({
      get: mockGet,
    });
  });

  it('fetches role capabilities', async () => {
    const { result } = renderHook(() => useRoleCapabilities(1), { wrapper });
    await act(() => result.current.isSuccess);

    expect(result.current.isSuccess).toBe(true);
    expect(result.current.initialRoleCapabilitiesSelectedMap).toEqual(expectedInitialRoleCapabilitiesSelectedMap);
    expect(result.current.capabilitiesTotalCount).toEqual(2);
  });
});
