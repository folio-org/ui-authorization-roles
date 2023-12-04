import React from 'react';
import {
  translationsProperties,
  renderWithIntl,
} from '@folio/stripes-erm-testing';
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
  <CapabilitiesSettings content={settingsTypeCapabilities} />,
  translationsProperties
);

describe('Settings capabilities type', () => {
  const { getByText } = renderComponent();

  it('renders fields in the grid', () => {
    expect(getByText('Inventory')).toBeInTheDocument();
    expect(getByText('Settings source')).toBeInTheDocument();
  });
});
