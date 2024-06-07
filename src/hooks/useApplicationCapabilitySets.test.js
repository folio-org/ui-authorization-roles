import { renderHook, cleanup } from '@folio/jest-config-stripes/testing-library/react';
import { waitFor } from '@folio/jest-config-stripes/testing-library/dom';
import useApplicationCapabilitySets from './useApplicationCapabilitySets';
import useChunkedApplicationCapabilitySets from './useChunkedApplicationCapabilitySets';

jest.mock('./useChunkedApplicationCapabilitySets');

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useStripes: jest.fn(() => ({ config: { maxUnpagedResourceCount: 10 },
    discovery: { applications: {
      cap1: {},
      cap12: {}
    } } })),
}));

describe('useApplicationCapabilitySets', () => {
  afterAll(() => {
    cleanup();
    jest.clearAllMocks();
  });
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should test if returning fields and methods are defined', () => {
    useChunkedApplicationCapabilitySets.mockReset().mockReturnValue({ items: [], isLoading: false });
    const { result } = renderHook(useApplicationCapabilitySets, { initialProps: { cap1: true } });

    expect(result.current.capabilitySets).toStrictEqual({ data: [], settings: [], procedural: [] });
    expect(result.current.roleCapabilitySetsListIds).toStrictEqual([]);
    expect(result.current.selectedCapabilitySetsMap).toStrictEqual({});
    expect(result.current.setSelectedCapabilitySetsMap).toBeDefined();
    expect(result.current.isLoading).toBe(false);
  });
  it('should set checkedAppIdsMap and call onSubmitSelectApplications', async () => {
    const items = [{ id: 1, applicationId: 'cap1', type: 'data', action:'edit', resource: 'r1' },
      { id: 12, applicationId: 'cap12', type: 'data', action: 'create', resource: 'r1' }];
    useChunkedApplicationCapabilitySets.mockClear().mockReturnValue({ items, isLoading: false });

    const { result } = renderHook(useApplicationCapabilitySets, { initialProps: { cap1: true } });

    expect(result.current.capabilitySets).toStrictEqual({
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
    useChunkedApplicationCapabilitySets.mockClear().mockReturnValue({ items: [], isLoading: false });
    const { result } = renderHook(useApplicationCapabilitySets, { initialProps: {} });

    await waitFor(async () => {
      expect(result.current.capabilitySets).toStrictEqual({ data: [], settings: [], procedural: [] });
      expect(result.current.selectedCapabilitySetsMap).toStrictEqual({});
    });
  });
});
