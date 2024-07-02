import { cleanup, render } from '@folio/jest-config-stripes/testing-library/react';
import '@folio/jest-config-stripes/testing-library/jest-dom';

import AssignUsers from './AssignUsers';
import {
  useAssignRolesToUserMutation,
  useDeleteUserRolesMutation,
  useUpdateUserRolesMutation,
  useUserRolesByUserIds,
} from '../../../hooks';

jest.mock('react-query');
jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useStripes: () => ({ hasPerm: jest.fn().mockReturnValue(true) }),
}));
jest.mock('../../../hooks', () => ({
  ...jest.requireActual('../../../hooks'),
  useAssignRolesToUserMutation: jest.fn(),
  useDeleteUserRolesMutation: jest.fn(),
  useUpdateUserRolesMutation: jest.fn(),
  useUserRolesByUserIds: jest.fn(),
}));

const userRoles = {
  'userRoles': [
    {
      'userId': '1',
      'roleId': '555'
    },
    {
      'userId': '3',
      'roleId': '111',
    }
  ]
};

const renderComponent = () => render(
  <AssignUsers selectedUsers={[{ id: '1' }]} roleId="555" refetch={jest.fn()} />
);

describe('AssignUsers component', () => {
  afterEach(() => {
    cleanup();
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  describe('displays AssignUsers', () => {
    useUserRolesByUserIds.mockReturnValue({ roleDetails: userRoles, isLoading: false });
    useAssignRolesToUserMutation.mockReturnValue({ mutateUpdateUserRoles: jest.fn(), isLoading: false });
    useUpdateUserRolesMutation.mockReturnValue({ mutateUpdateUserRoles: jest.fn(), isLoading: false });
    useDeleteUserRolesMutation.mockReturnValue({ mutateDeleteUserRoles: jest.fn(), isLoading: false });
    const { getByText } = renderComponent();

    it('doesn\'t render assign button', () => {
      getByText('ui-users.permissions.assignUsers.actions.assign.notAvailable');
    });
  });
});
