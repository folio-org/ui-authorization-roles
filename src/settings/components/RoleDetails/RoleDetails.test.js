import { cleanup, render } from '@folio/jest-config-stripes/testing-library/react';
import '@folio/jest-config-stripes/testing-library/jest-dom';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

import RoleDetails from './RoleDetails';
import useRoleById from '../../../hooks/useRoleById';
import renderWithRouter from '../../../../test/jest/helpers/renderWithRouter';
import useDeleteRoleMutation from '../../../hooks/useDeleteRoleMutation';

const mockHistoryPushFn = jest.fn();

jest.mock('../../../hooks/useRoleById');
jest.mock('../../../hooks/useDeleteRoleMutation');

jest.mock('react-router', () => {
  return { ...jest.requireActual('react-router'),
    useHistory: jest.fn().mockReturnValue({ push: (path) => mockHistoryPushFn(path), location: { search: '' } }) };
});

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
    <RoleDetails roleId="2efe1d13-eff9-4b01-a2fe-512e9d5239c7" />
  )
);

const mockMutateDeleteRole = jest.fn();

useRoleById.mockReturnValue({ roleDetails: getRoleData(), isRoleDetailsLoaded: true });
useDeleteRoleMutation.mockReturnValue({ mutateAsync: mockMutateDeleteRole });
jest.mock('./AccordionCapabilities', () => () => <div>Accordion capabilities</div>);
jest.mock('./AccordionCapabilitySets', () => () => <div>Accordion capability sets</div>);
jest.mock('./AccordionUsers', () => () => <div>Accordion users</div>);

describe('RoleDetails component', () => {
  afterAll(() => {
    cleanup();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('renders roles details pane with expanded information', () => {
    it('render expanded role info by default', () => {
      const { getByText } = renderComponent();
      getByText('Accordion capabilities');
      getByText('Accordion capability sets');
      getByText('Accordion users');
    });

    it('test confirm delete action', async () => {
      const { getByRole, getByText } = renderComponent();

      await userEvent.click(getByRole('button', { name: 'stripes-components.paneMenuActionsToggleLabel' }));
      await userEvent.click(getByRole('button', { name:'ui-authorization-roles.crud.delete' }));
      await userEvent.click(getByText('confirm'));

      expect(mockMutateDeleteRole).toHaveBeenCalledWith('2efe1d13-eff9-4b01-a2fe-512e9d5239c7');
    });

    it('test cancel delete action', async () => {
      const { getByRole, getByText } = renderComponent();

      await userEvent.click(getByRole('button', { name: 'stripes-components.paneMenuActionsToggleLabel' }));
      await userEvent.click(getByRole('button', { name:'ui-authorization-roles.crud.delete' }));
      await userEvent.click(getByText('cancel'));
    });

    it('calls onClose function on close details button', async () => {
      renderComponent();
      const closeButton = document.querySelector('[data-test-pane-header-dismiss-button]');
      await userEvent.click(closeButton);

      expect(mockHistoryPushFn).toHaveBeenCalledWith('/');
    });

    it('calls edit function on click dropdown edit button', async () => {
      const { getByText } = renderComponent();

      await userEvent.click(getByText('ui-authorization-roles.crud.edit'));
      expect(mockHistoryPushFn).toHaveBeenCalledWith('/2efe1d13-eff9-4b01-a2fe-512e9d5239c7/edit');
    });
  });
});
