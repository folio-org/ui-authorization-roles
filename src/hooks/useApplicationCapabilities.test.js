import { renderHook } from '@folio/jest-config-stripes/testing-library/react';
import { waitFor } from '@folio/jest-config-stripes/testing-library/dom';
import useApplicationCapabilities from './useApplicationCapabilities';
import useChunkedApplicationCapabilities from './useChunkedApplicationCapabilities';
import useChunkedApplicationCapabilitySets from './useChunkedApplicationCapabilitySets';

jest.mock('./useChunkedApplicationCapabilities');
jest.mock('./useChunkedApplicationCapabilitySets');

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useStripes: jest.fn(() => ({ config: { maxUnpagedResourceCount: 10 },
    discovery: { applications: {
      cap1: {},
      cap12: {}
    } } })),
}));

describe('useApplicationCapabilities', () => {
  it('should test if returning fields and methods are defined', () => {
    useChunkedApplicationCapabilities.mockClear().mockReturnValue({ items: [], isLoading: false });
    useChunkedApplicationCapabilitySets.mockClear().mockReturnValue({ items: [], isLoading: false });
    const { result } = renderHook(useApplicationCapabilities);
    expect(result.current.checkedAppIdsMap).toStrictEqual({});
    expect(result.current.onSubmitSelectApplications).toBeDefined();
    expect(result.current.capabilities).toStrictEqual({ data: [], settings: [], procedural: [] });
    expect(result.current.roleCapabilitiesListIds).toStrictEqual([]);
    expect(result.current.selectedCapabilitiesMap).toStrictEqual({});
    expect(result.current.setSelectedCapabilitiesMap).toBeDefined();
  });
  it('should set checkedAppIdsMap and call onSubmitSelectApplications', async () => {
    const { result } = renderHook(useApplicationCapabilities);

    const items = [{ id: 1, applicationId: 'cap1', type: 'data', action:'edit', resource: 'r1' }, { id: 12, applicationId: 'cap12', type: 'data', action: 'create', resource: 'r1' }];
    useChunkedApplicationCapabilities.mockClear().mockReturnValue({ items, isLoading: false });
    const appIds = { cap1: true };

    const onClose = jest.fn();

    await waitFor(async () => {
      await result.current.onSubmitSelectApplications(appIds, onClose);
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
  });

  it('should set empty capabilities in the case of empty appIds', async () => {
    useChunkedApplicationCapabilities.mockClear().mockReturnValue({ items: [], isLoading: false });
    useChunkedApplicationCapabilitySets.mockClear().mockReturnValue({ items: [], isLoading: false });
    const { result } = renderHook(useApplicationCapabilities);
    const appIds = {};

    const onClose = jest.fn();

    await waitFor(async () => {
      await result.current.onSubmitSelectApplications(appIds, onClose);

      expect(result.current.capabilities).toStrictEqual({ data: [], settings: [], procedural: [] });
      expect(result.current.selectedCapabilitiesMap).toStrictEqual({});
    });
  });

  it('should call initial load function with empty app ids', async () => {
    const { result } = renderHook(useApplicationCapabilities);
    useChunkedApplicationCapabilities.mockClear().mockReturnValue({ items: [], isLoading: false });
    useChunkedApplicationCapabilitySets.mockClear().mockReturnValue({ items: [], isLoading: false });
    const appIds = {};

    await waitFor(async () => {
      await result.current.onInitialLoad(appIds);

      expect(result.current.capabilities).toStrictEqual({ data: [], settings: [], procedural: [] });
      expect(result.current.selectedCapabilitiesMap).toStrictEqual({});
    });
  });
});
