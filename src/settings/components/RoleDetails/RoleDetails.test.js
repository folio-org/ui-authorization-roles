import React from 'react';

import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

import { render } from '@folio/jest-config-stripes/testing-library/react';
import RoleDetails from './RoleDetails';
import useRoleById from '../../../hooks/useRoleById';
import renderWithRouter from '../../../../test/jest/helpers/renderWithRouter';


jest.mock('../../../hooks/useRoleById');

const onClose = jest.fn();
const getRoleData = (data) => ({
  id: '2efe1d13-eff9-4b01-a2fe-512e9d5239c7',
  name: 'demo test role',
  description: 'simple description',
  metadata: {
    createdDate: '2023-03-14T12:07:17.594+00:00',
    createdBy: 'db3bcf41-767f-4a4a-803d-bd5a41ace9b1',
    modifiedDate: '2023-03-14T12:07:17.594+00:00',
  },
  capabilities:['setting-capability-id'],
  ...data,
});

const renderComponent = () => render(
  renderWithRouter(
    <RoleDetails onClose={onClose} roleId="1" />
  )
);

useRoleById.mockReturnValue({ roleDetails: getRoleData(), isRoleDetailsLoaded: true });
jest.mock('./AccordionCapabilities', () => () => <div>Accordion capabilities</div>);
jest.mock('./AccordionCapabilitySets', () => () => <div>Accordion capability sets</div>);
jest.mock('./AccordionUsers', () => () => <div>Accordion users</div>);

describe('RoleDetails component', () => {
  afterEach(() => {
    cleanup();
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  describe('renders roles details pane with expanded information', () => {
    const { getByText } = renderComponent();

    it('render expanded role info by default', () => {
      getByText('Accordion capabilities');
      getByText('Accordion capability sets');
      getByText('Accordion users');
    });
  });
});
