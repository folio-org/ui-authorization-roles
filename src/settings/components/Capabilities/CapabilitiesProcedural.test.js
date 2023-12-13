import React from 'react';
import { MemoryRouter } from 'react-router';
import userEvent from '@testing-library/user-event';

import {
  translationsProperties,
  renderWithIntl,
} from '@folio/stripes-erm-testing';
import { CapabilitiesProcedural } from './CapabilitiesProcedural';
import '@testing-library/jest-dom';

const proceduralTypeCapabilities = [
  {
    id: '8d2da27c-1d56-48b6-958d-2bfae6d7922dc8',
    applicationId: 'Fees/fines-22.3',
    name: 'foo_item.delete',
    description: 'Login: Delete foo item',
    resource: 'Settings source',
    action: 'execute',
    type: 'procedural',
    permissions: ['foo.item.post'],
  },
];

const renderComponent = (data, onChange) => renderWithIntl(
  <MemoryRouter>
    <CapabilitiesProcedural content={data} isCapabilitySelected={jest.fn().mockReturnValue(true)} onChangeCapabilityCheckbox={onChange} />
  </MemoryRouter>,
  translationsProperties
);

describe('Procedural capabilities type', () => {
  afterAll(() => {
    jest.clearAllMocks();
  });
  it('renders fields in the grid', () => {
    const mockChangeHandler = jest.fn();
    const { getByText } = renderComponent(proceduralTypeCapabilities, mockChangeHandler);
    expect(getByText('Settings source')).toBeInTheDocument();
    expect(getByText('Fees/fines')).toBeInTheDocument();
  });

  it('renders checkboxes', async () => {
    const mockChangeHandler = jest.fn().mockReturnValue(true);
    const { getAllByRole } = renderComponent(proceduralTypeCapabilities, mockChangeHandler);

    expect(getAllByRole('checkbox')).toHaveLength(1);
    expect(getAllByRole('checkbox')[0]).toBeChecked();

    await userEvent.click(getAllByRole('checkbox')[0]);

    expect(mockChangeHandler).toHaveBeenCalled();
  });

  it('renders null if action name is not execute', async () => {
    const mockChangeHandler = jest.fn().mockReturnValue(true);
    const { queryAllByRole } = renderComponent([{ ...proceduralTypeCapabilities[0], action: 'view' }], mockChangeHandler);

    expect(queryAllByRole('checkbox')).toHaveLength(0);
  });
});
