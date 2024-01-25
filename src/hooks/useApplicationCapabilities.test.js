import { renderHook } from '@folio/jest-config-stripes/testing-library/react';
import { waitFor } from '@testing-library/dom';
import { useOkapiKy } from '@folio/stripes/core';
import useApplicationCapabilities from './useApplicationCapabilties';

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useStripes: jest.fn(() => ({ config: { maxUnpagedResourceCount: 10 } })),
}));

describe('useApplicationCapabilities', () => {
  it('should set checkedAppIdsMap and call onSubmitSelectApplications', async () => {
    const { result } = renderHook(useApplicationCapabilities);
    expect(result.current.checkedAppIdsMap).toEqual({});
    expect(result.current.onSubmitSelectApplications).toBeDefined();

    const data = { capabilities: [{ id: 1, name: 'cap1' }, { id: 12, name: 'cap12' }] };

    const mockGet = jest.fn(() => ({
      json: () => Promise.resolve(data),
    }));

    useOkapiKy.mockClear().mockReturnValue({
      get: mockGet,
    });

    const appIds = { appId1: true, appId2: false, appId3: true };
    const setSelectedCapabilitiesMap = jest.fn();
    const onClose = jest.fn();

    await waitFor(async () => {
      await result.current.onSubmitSelectApplications({ appIds, onClose, setSelectedCapabilitiesMap });
      expect(setSelectedCapabilitiesMap).toHaveBeenCalledWith({ 1: true, 12: true });
    });
  });

  it('it cleans up all selected capabilities on submit empty list of selected applications', async () => {
    const { result } = renderHook(useApplicationCapabilities);
    const setSelectedCapabilitiesMap = jest.fn();
    const onClose = jest.fn();

    await waitFor(async () => {
      await result.current.onSubmitSelectApplications({ appIds: {}, onClose, setSelectedCapabilitiesMap });

      expect(setSelectedCapabilitiesMap).toHaveBeenCalledWith({});
    });
  });
});
