import { renderHook } from '@folio/jest-config-stripes/testing-library/react';
import { waitFor } from '@testing-library/dom';
import { useOkapiKy } from '@folio/stripes/core';
import useApplicationCapabilities from './useApplicationCapabilties';

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useStripes: jest.fn(() => ({ config: { maxUnpagedResourceCount: 10 } })),
}));

describe('useApplicationCapabilities', () => {
  it('should test if returning checkedAppIds and onSubmitSelectApplications are defined', () => {
    const { result } = renderHook(useApplicationCapabilities);
    expect(result.current.checkedAppIdsMap).toEqual({});
    expect(result.current.onSubmitSelectApplications).toBeDefined();
  });
  it('should set checkedAppIdsMap and call onSubmitSelectApplications', async () => {
    const { result } = renderHook(useApplicationCapabilities);

    const data = { capabilities: [{ id: 1, applicationId: 'cap1', type: 'settings' }, { id: 12, applicationId: 'cap12', type: 'data' }] };

    const mockGet = jest.fn(() => ({
      json: () => Promise.resolve(data),
    }));

    useOkapiKy.mockClear().mockReturnValue({
      get: mockGet,
    });

    const appIds = { appId1: true, appId2: false, appId3: true };
    const setCapabilities = jest.fn();
    const handleSelectedCapabilitiesOnChangeSelectedApplication = jest.fn();
    const onClose = jest.fn();

    await waitFor(async () => {
      await result.current.onSubmitSelectApplications({ appIds, onClose, setCapabilities, handleSelectedCapabilitiesOnChangeSelectedApplication });
      expect(setCapabilities).toHaveBeenCalledTimes(1);
      expect(handleSelectedCapabilitiesOnChangeSelectedApplication).toHaveBeenCalledTimes(1);
    });
  });

  it('it cleans up all selected capabilities on submit empty list of selected applications', async () => {
    const { result } = renderHook(useApplicationCapabilities);
    const setCapabilities = jest.fn();
    const handleSelectedCapabilitiesOnChangeSelectedApplication = jest.fn();
    const onClose = jest.fn();

    await waitFor(async () => {
      await result.current.onSubmitSelectApplications({ appIds: {}, onClose, setCapabilities, handleSelectedCapabilitiesOnChangeSelectedApplication });

      expect(setCapabilities).toHaveBeenCalledWith({ data: [], procedural: [], settings: [] });
      expect(handleSelectedCapabilitiesOnChangeSelectedApplication).toHaveBeenCalledWith([]);
    });
  });
});
