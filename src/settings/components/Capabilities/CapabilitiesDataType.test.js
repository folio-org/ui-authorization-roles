import React from 'react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import { render } from '@folio/jest-config-stripes/testing-library/react';
import '@folio/jest-config-stripes/testing-library/jest-dom';

import { CapabilitiesDataType } from './CapabilitiesDataType';

const dataTypeCapabilities = [
  {
    id: '8d2da27c-1d56-48b6-923358d-2bfae6d79dc8',
    applicationId: 'Circulation-2',
    name: 'foo_item.create',
    description: 'Sample: Create foo item',
    resource: 'Foo Item',
    action: 'create',
    type: 'data',
    permissions: ['foo.item.post'],
    actions: { view: 'view-id', create: 'create-id', edit: 'edit-id', delete: 'delete-id' },
  },
];

const renderComponent = (data, onChange) => render(
  <CapabilitiesDataType content={data} isCapabilitySelected={jest.fn().mockReturnValue(true)} onChangeCapabilityCheckbox={onChange} />
);

describe('Data capabilities type', () => {
  afterAll(() => {
    jest.clearAllMocks();
  });

  it('renders fields in the grid', () => {
    const { getByText } = renderComponent(dataTypeCapabilities);

    expect(getByText('Foo Item')).toBeInTheDocument();
    expect(getByText('Circulation')).toBeInTheDocument();
  });

  it('renders checkboxes', async () => {
    const mockChangeHandler = jest.fn();
    const { getAllByRole } = renderComponent(dataTypeCapabilities, mockChangeHandler);

    expect(getAllByRole('checkbox')).toHaveLength(4);
    expect(getAllByRole('checkbox')[0]).toBeChecked();

    await userEvent.click(getAllByRole('checkbox')[0]);

    expect(mockChangeHandler).toHaveBeenCalled();
  });
});
