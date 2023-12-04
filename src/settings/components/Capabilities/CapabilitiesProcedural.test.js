import React from 'react';
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
    actions: {
      view: false,
      edit: false,
      create: false,
      delete: false,
      manage: false,
    },
  },
];

const renderComponent = () => renderWithIntl(
  <CapabilitiesProcedural content={proceduralTypeCapabilities} />,
  translationsProperties
);

describe('Procedural capabilities type', () => {
  const { getByText } = renderComponent();

  it('renders fields in the grid', () => {
    expect(getByText('Settings source')).toBeInTheDocument();
    expect(getByText('Fees/fines')).toBeInTheDocument();
  });
});
