import React from 'react';
import { MemoryRouter } from 'react-router';
import userEvent from '@testing-library/user-event';

import {
  renderWithIntl,
} from '@folio/stripes-erm-testing';

import { translationsProperties } from '../../../../test/helpers';
import { CapabilitiesDataType } from './CapabilitiesDataType';
import '@testing-library/jest-dom';

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
  },
];

const renderComponent = (data, onChange) => renderWithIntl(
  <MemoryRouter>
    <CapabilitiesDataType content={data} isCapabilitySelected={jest.fn().mockReturnValue(true)} onChangeCapabilityCheckbox={onChange} />
  </MemoryRouter>,
  translationsProperties
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

    expect(getAllByRole('checkbox')).toHaveLength(1);
    expect(getAllByRole('checkbox')[0]).toBeChecked();

    await userEvent.click(getAllByRole('checkbox')[0]);

    expect(mockChangeHandler).toHaveBeenCalled();
  });
});
