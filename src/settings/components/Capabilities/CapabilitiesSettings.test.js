import React from 'react';
import userEvent from '@testing-library/user-event';

import { render } from '@folio/jest-config-stripes/testing-library/react';
import { CapabilitiesSettings } from './CapabilitiesSettings';
import '@testing-library/jest-dom';

const settingsTypeCapabilities = [
  {
    id: '8d2da27c-1d56-48b6-9534218d-2bfae6d79dc8',
    applicationId: 'Inventory-2.0',
    name: 'foo_item.delete',
    description: 'Settings: Delete foo item',
    resource: 'Settings source',
    action: 'edit',
    type: 'settings',
    permissions: ['foo.item.post'],
  },
];

const renderComponent = (data, onChange) => render(
  <CapabilitiesSettings content={data} isCapabilitySelected={jest.fn().mockReturnValue(true)} onChangeCapabilityCheckbox={onChange} />
);

describe('Settings capabilities type', () => {
  afterAll(() => {
    jest.clearAllMocks();
  });

  it('renders fields in the grid', () => {
    const { getByText } = renderComponent(settingsTypeCapabilities, jest.fn());
    expect(getByText('Inventory')).toBeInTheDocument();
    expect(getByText('Settings source')).toBeInTheDocument();
  });

  it('renders checkboxes', async () => {
    const mockChangeHandler = jest.fn().mockReturnValue(true);
    const { getAllByRole } = renderComponent(settingsTypeCapabilities, mockChangeHandler);

    expect(getAllByRole('checkbox')).toHaveLength(1);
    expect(getAllByRole('checkbox')[0]).toBeChecked();

    await userEvent.click(getAllByRole('checkbox')[0]);

    expect(mockChangeHandler).toHaveBeenCalled();
  });

  it('renders null if action name is not execute', async () => {
    const mockChangeHandler = jest.fn().mockReturnValue(true);
    const { queryAllByRole } = renderComponent([{ ...settingsTypeCapabilities[0], action: 'execute' }], mockChangeHandler);

    expect(queryAllByRole('checkbox')).toHaveLength(0);
  });
});
