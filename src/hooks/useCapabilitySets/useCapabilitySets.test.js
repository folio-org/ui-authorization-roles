import { renderHook } from '@folio/jest-config-stripes/testing-library/react';
import { useChunkedCQLFetch } from '@folio/stripes/core';
import {
  APPLICATIONS_STEP_SIZE,
  CAPABILITIES_LIMIT,
} from '@folio/stripes-authorization-components';

import useCapabilitySets from './useCapabilitySets';

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

describe('useCapabilitySets', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return loading state initially', () => {
    useChunkedCQLFetch.mockReturnValue({
      items: [],
      isLoading: true,
    });

    const { result } = renderHook(() => useCapabilitySets());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.capabilitySetsList).toEqual([]);
  });

  it('should return capabilities list after fetching', () => {
    const mockData = [
      { data: { capabilitySets: ['capability1', 'capability2'] } },
      { data: { capabilitySets: ['capability3'] } }
    ];

    useChunkedCQLFetch.mockReturnValue({
      items: mockData.flatMap(d => d.data.capabilitySets),
      isLoading: false,
    });

    const { result } = renderHook(useCapabilitySets);

    expect(result.current.isLoading).toBe(false);
    expect(result.current.capabilitySetsList).toEqual(['capability1', 'capability2', 'capability3']);
  });

  it('should handle empty capabilities list', () => {
    useChunkedCQLFetch.mockReturnValue({
      items: [],
      isLoading: false,
    });

    const { result } = renderHook(useCapabilitySets);

    expect(result.current.isLoading).toBe(false);
    expect(result.current.capabilitySetsList).toEqual([]);
  });

  it('should chunk requests to avoid hitting limits', () => {
    renderHook(useCapabilitySets);

    expect(useChunkedCQLFetch).toHaveBeenCalledWith({
      endpoint: 'capability-sets',
      ids:['app1', 'app2'],
      limit: CAPABILITIES_LIMIT,
      idName: 'applicationId',
      reduceFunction: expect.any(Function),
      generateQueryKey: expect.any(Function),
      STEP_SIZE: APPLICATIONS_STEP_SIZE
    });
  });

  it('should chunk requests to avoid hitting limits', () => {
    renderHook(useCapabilitySets);

    expect(useChunkedCQLFetch).toHaveBeenCalledWith({
      endpoint: 'capability-sets',
      ids:['app1', 'app2'],
      limit: CAPABILITIES_LIMIT,
      idName: 'applicationId',
      reduceFunction: expect.any(Function),
      generateQueryKey: expect.any(Function),
      STEP_SIZE: APPLICATIONS_STEP_SIZE
    });
  });

  it('should reduce data correctly using reduceFunction', () => {
    const mockData = [
      { data: { capabilitySets: [{ id: 1 }, { id: 2 }] } },
      { data: { capabilitySets: [{ id: 3 }] } },
    ];

    useChunkedCQLFetch.mockClear().mockImplementation(({ reduceFunction, generateQueryKey }) => {
      generateQueryKey(['capability-sets']);
      const items = reduceFunction(mockData);
      return { items, isLoading: false };
    });

    const { result } = renderHook(useCapabilitySets);

    expect(result.current.capabilitySetsList).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }]);
    expect(result.current.isLoading).toBe(false);
  });
});
