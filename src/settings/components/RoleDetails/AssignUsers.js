import { useMemo, useState } from 'react';
import { useQueryClient } from 'react-query';

import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { keyBy } from 'lodash';

import { useStripes, Pluggable, useOkapiKy } from '@folio/stripes/core';

import { apiVerbs, createUserRolesRequests } from './utils';
import { USERS_BY_ROLE_ID_QUERY_KEY } from '../../../hooks/useUsersByRoleId';

import useUpdateUserRolesMutation from '../../../hooks/useUpdateUserRolesMutation';
import useAssignRolesToUserMutation from '../../../hooks/useAssignRolesToUserMutation';
import useDeleteUserRolesMutation from '../../../hooks/useDeleteUserRolesMutation';

const AssignUsers = ({ selectedUsers, roleId, refetch }) => {
  const stripes = useStripes();
  const okapiKy = useOkapiKy();
  const queryClient = useQueryClient();

  const { mutateUpdateUserRoles } = useUpdateUserRolesMutation();
  const { mutateAssignRolesToUser } = useAssignRolesToUserMutation();
  const { mutateDeleteUserRoles } = useDeleteUserRolesMutation();
  const [users, setUsers] = useState([]);
  const initialSelectedUsers = useMemo(() => keyBy(selectedUsers, 'id'), [selectedUsers]);

  /**
   * assignUsers
   * Callback from the plugin receives an updated list of selected users.
   * Since we only have 1/2 an API and cannot manipulate a role's users,
   * we instead have to manipulate each user's roles.
   *
   * @param {*} newSelectedUsers
   */
  const assignUsers = async (newSelectedUsers) => {
    setUsers(newSelectedUsers);

    const requests = await createUserRolesRequests(Object.values(initialSelectedUsers), users, roleId, queryClient, okapiKy);
    const promises = [];

    for (const request of requests) {
      const { apiVerb, userId, roleIds } = request;
      switch (apiVerb) {
        case apiVerbs.PUT:
          stripes.logger.log('authz-roles', `updating roles for ${userId}:: ${roleIds.join(', ')}`);
          promises.push(mutateUpdateUserRoles({ userId, roleIds }));
          break;
        case apiVerbs.POST:
          stripes.logger.log('authz-roles', `creating role for ${userId}:: ${roleIds.join(', ')}`);
          promises.push(mutateAssignRolesToUser({ userId, roleIds }));
          break;
        case apiVerbs.DELETE:
          stripes.logger.log('authz-roles', `removing roles for ${userId}`);
          promises.push(mutateDeleteUserRoles({ userId }));
          break;
        default:
          break;
      }
    }

    if (promises.length) {
      await Promise.allSettled(promises);
      // Refresh user list
      queryClient.invalidateQueries(USERS_BY_ROLE_ID_QUERY_KEY);
      await refetch();
    }
  };

  return (
    <Pluggable
      aria-haspopup="true"
      dataKey="assignUsers"
      id="clickable-plugin-assign-users"
      searchButtonStyle="default"
      searchLabel={<FormattedMessage id="ui-authorization-roles.assignUnassign" />}
      stripes={stripes}
      type="find-user"
      selectUsers={assignUsers}
      initialSelectedUsers={initialSelectedUsers}
    >
      <FormattedMessage id="ui-users.permissions.assignUsers.actions.assign.notAvailable" />
    </Pluggable>
  );
};

AssignUsers.propTypes = {
  selectedUsers: PropTypes.arrayOf(PropTypes.object),
  roleId: PropTypes.string,
  refetch: PropTypes.func
};

export default AssignUsers;
