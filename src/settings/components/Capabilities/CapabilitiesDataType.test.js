import React from 'react';

import {
  translationsProperties,
  renderWithIntl,
} from '@folio/stripes-erm-testing';
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
  <CapabilitiesDataType content={dataTypeCapabilities} />,
  translationsProperties
);

describe('Data capabilities type', () => {
  const { getByText } = renderComponent();

  it('renders fields in the grid', () => {
    expect(getByText('Foo Item')).toBeInTheDocument();
    expect(getByText('Circulation')).toBeInTheDocument();
  });
});
