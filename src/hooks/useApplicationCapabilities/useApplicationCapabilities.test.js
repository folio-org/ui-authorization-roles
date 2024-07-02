import {
  renderHook,
  cleanup,
} from '@folio/jest-config-stripes/testing-library/react';
import { waitFor } from '@folio/jest-config-stripes/testing-library/dom';

import { useChunkedApplicationCapabilities } from '../useChunkedApplicationCapabilities';
import useApplicationCapabilities from './useApplicationCapabilities';

jest.mock('../useChunkedApplicationCapabilities', () => ({
  useChunkedApplicationCapabilities: jest.fn()
}));

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useStripes: jest.fn(() => ({ config: { maxUnpagedResourceCount: 10 },
    discovery: { applications: {
      cap1: {},
      cap12: {}
    } } })),
}));

describe('useApplicationCapabilities', () => {
  afterAll(() => {
    cleanup();
    jest.clearAllMocks();
  });
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should test if returning fields and methods are defined', () => {
    useChunkedApplicationCapabilities.mockReset().mockReturnValue({ items: [], isLoading: false });
    const { result } = renderHook(useApplicationCapabilities, { initialProps: { cap1: true } });

    expect(result.current.capabilities).toStrictEqual({ data: [], settings: [], procedural: [] });
    expect(result.current.roleCapabilitiesListIds).toStrictEqual([]);
    expect(result.current.selectedCapabilitiesMap).toStrictEqual({});
    expect(result.current.setSelectedCapabilitiesMap).toBeDefined();
    expect(result.current.isLoading).toBe(false);
  });
  it('should set checkedAppIdsMap and call onSubmitSelectApplications', async () => {
    const items = [
      { id: 1, applicationId: 'cap1', type: 'data', action:'edit', resource: 'r1' },
      { id: 12, applicationId: 'cap12', type: 'data', action: 'create', resource: 'r1' }
    ];
    useChunkedApplicationCapabilities.mockClear().mockReturnValue({ items, isLoading: false });

    const { result } = renderHook(useApplicationCapabilities, { initialProps: { cap1: true } });

    expect(result.current.capabilities).toStrictEqual({
      data:  [
        {
          actions: {
            edit: 1,
          },
          applicationId: 'cap1',
          id: 1,
          resource: 'r1',
        },
        {
          actions: {
            create: 12,
          },
          applicationId: 'cap12',
          id: 12,
          resource: 'r1',
        },
      ],
      procedural:  [],
      settings:  [],
    });
  });

  it('should set empty capabilities in the case of empty appIds', async () => {
    useChunkedApplicationCapabilities.mockClear().mockReturnValue({ items: [], isLoading: false });
    const { result } = renderHook(useApplicationCapabilities, { initialProps: {} });

    await waitFor(async () => {
      expect(result.current.capabilities).toStrictEqual({ data: [], settings: [], procedural: [] });
      expect(result.current.selectedCapabilitiesMap).toStrictEqual({});
    });
  });
});
