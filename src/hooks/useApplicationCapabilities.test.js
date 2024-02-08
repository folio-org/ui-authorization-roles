import { renderHook } from '@folio/jest-config-stripes/testing-library/react';
import { waitFor } from '@testing-library/dom';
import { useOkapiKy } from '@folio/stripes/core';
import useApplicationCapabilities from './useApplicationCapabilities';

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useStripes: jest.fn(() => ({ config: { maxUnpagedResourceCount: 10 } })),
}));

describe('useApplicationCapabilities', () => {
  it('should test if returning fields and methods are defined', () => {
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

    const data = { capabilities: [{ id: 1, applicationId: 'cap1', type: 'data', action:'edit', resource: 'r1' }, { id: 12, applicationId: 'cap12', type: 'data', action: 'create', resource: 'r1' }] };

    const mockGet = jest.fn(() => ({
      json: () => Promise.resolve(data),
    }));

    useOkapiKy.mockClear().mockReturnValue({
      get: mockGet,
    });

    const appIds = { 1: true };

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
    const { result } = renderHook(useApplicationCapabilities);

    const data = { capabilities: [{ id: 1, applicationId: 'cap1', type: 'data', action:'edit', resource: 'r1' }, { id: 12, applicationId: 'cap12', type: 'data', action: 'create', resource: 'r1' }] };

    const mockGet = jest.fn(() => ({
      json: () => Promise.resolve(data),
    }));

    useOkapiKy.mockClear().mockReturnValue({
      get: mockGet,
    });

    const appIds = {};

    const onClose = jest.fn();

    await waitFor(async () => {
      await result.current.onSubmitSelectApplications(appIds, onClose);

      expect(result.current.capabilities).toStrictEqual({ data: [], settings: [], procedural: [] });
      expect(result.current.selectedCapabilitiesMap).toStrictEqual({});
    });
  });
});
