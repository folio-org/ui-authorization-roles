import { renderHook } from '@folio/jest-config-stripes/testing-library/react';
import { useChunkedCQLFetch } from '@folio/stripes/core';
import useCapabilities from './useCapabilities';
import { APPLICATIONS_STEP_SIZE, CAPABILITES_LIMIT } from './constants';

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useChunkedCQLFetch: jest.fn(),
  useNamespace: jest.fn(() => ['capabilities-list']),
  useStripes: jest.fn(() => ({ config: { maxUnpagedResourceCount: 10 },
    discovery: { applications: {
      app1: {},
      app2: {}
    } } })),
}));

describe('useCapabilities', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return loading state initially', () => {
    useChunkedCQLFetch.mockReturnValue({
      items: [],
      isLoading: true,
    });

    const { result } = renderHook(() => useCapabilities());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.capabilitiesList).toEqual([]);
  });

  it('should return capabilities list after fetching', () => {
    const mockData = [
      { data: { capabilities: ['capability1', 'capability2'] } },
      { data: { capabilities: ['capability3'] } }
    ];

    useChunkedCQLFetch.mockReturnValue({
      items: mockData.flatMap(d => d.data.capabilities),
      isLoading: false,
    });

    const { result } = renderHook(useCapabilities);

    expect(result.current.isLoading).toBe(false);
    expect(result.current.capabilitiesList).toEqual(['capability1', 'capability2', 'capability3']);
  });

  it('should handle empty capabilities list', () => {
    useChunkedCQLFetch.mockReturnValue({
      items: [],
      isLoading: false,
    });

    const { result } = renderHook(useCapabilities);

    expect(result.current.isLoading).toBe(false);
    expect(result.current.capabilitiesList).toEqual([]);
  });

  it('should chunk requests to avoid hitting limits', () => {
    renderHook(useCapabilities);

    expect(useChunkedCQLFetch).toHaveBeenCalledWith({
      endpoint: 'capabilities',
      ids:['app1', 'app2'],
      limit: CAPABILITES_LIMIT,
      idName: 'applicationId',
      reduceFunction: expect.any(Function),
      generateQueryKey: expect.any(Function),
      STEP_SIZE: APPLICATIONS_STEP_SIZE
    });
  });

  it('should chunk requests to avoid hitting limits', () => {
    renderHook(useCapabilities);

    expect(useChunkedCQLFetch).toHaveBeenCalledWith({
      endpoint: 'capabilities',
      ids:['app1', 'app2'],
      limit: CAPABILITES_LIMIT,
      idName: 'applicationId',
      reduceFunction: expect.any(Function),
      generateQueryKey: expect.any(Function),
      STEP_SIZE: APPLICATIONS_STEP_SIZE
    });
  });

  it('should reduce data correctly using reduceFunction', () => {
    const mockData = [
      { data: { capabilities: [{ id: 1 }, { id: 2 }] } },
      { data: { capabilities: [{ id: 3 }] } },
    ];

    useChunkedCQLFetch.mockClear().mockImplementation(({ reduceFunction, generateQueryKey }) => {
      generateQueryKey(['capabilities-list']);
      const items = reduceFunction(mockData);
      return { items, isLoading: false };
    });

    const { result } = renderHook(useCapabilities);

    expect(result.current.capabilitiesList).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }]);
    expect(result.current.isLoading).toBe(false);
  });
});
