import { renderHook } from '@folio/jest-config-stripes/testing-library/react';
import { useChunkedCQLFetch } from '@folio/stripes/core';
import useChunkedApplicationCapabilities from './useChunkedApplicationCapabilities';
import { CAPABILITES_LIMIT } from './constants';

jest.mock('@folio/stripes/core', () => ({
  useChunkedCQLFetch: jest.fn(),
}));

describe('useChunkedApplicationCapabilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call useChunkedCQLFetch with correct parameters when appIds is not empty', () => {
    const mockAppIds = ['app1', 'app2'];

    useChunkedCQLFetch.mockReturnValue({
      items: [],
      isLoading: true,
    });

    const { result } = renderHook(() => useChunkedApplicationCapabilities(mockAppIds));

    expect(useChunkedCQLFetch).toHaveBeenCalledWith({
      endpoint: 'capabilities',
      ids: mockAppIds,
      limit: CAPABILITES_LIMIT,
      idName: 'applicationId',
      queryOptions: {
        enabled: true,
      },
      reduceFunction: expect.any(Function),
      STEP_SIZE: 1,
    });

    expect(result.current.items).toEqual([]);
    expect(result.current.isLoading).toBe(true);
  });

  it('should call useChunkedCQLFetch with correct parameters when appIds is empty', () => {
    const mockAppIds = [];

    useChunkedCQLFetch.mockReturnValue({
      items: [],
      isLoading: false,
    });

    const { result } = renderHook(() => useChunkedApplicationCapabilities(mockAppIds));

    expect(useChunkedCQLFetch).toHaveBeenCalledWith({
      endpoint: 'capabilities',
      ids: mockAppIds,
      limit: CAPABILITES_LIMIT,
      idName: 'applicationId',
      queryOptions: {
        enabled: false,
      },
      reduceFunction: expect.any(Function),
      STEP_SIZE: 1,
    });

    expect(result.current.items).toEqual([]);
    expect(result.current.isLoading).toBe(false);
  });

  it('should reduce data correctly using reduceFunction', () => {
    const mockAppIds = ['app1', 'app2'];

    const mockData = [
      { data: { capabilities: [{ id: 1 }, { id: 2 }] } },
      { data: { capabilities: [{ id: 3 }] } },
    ];

    useChunkedCQLFetch.mockImplementation(({ reduceFunction }) => {
      const items = reduceFunction(mockData);
      return { items, isLoading: false };
    });

    const { result } = renderHook(() => useChunkedApplicationCapabilities(mockAppIds));

    expect(result.current.items).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }]);
    expect(result.current.isLoading).toBe(false);
  });
});
