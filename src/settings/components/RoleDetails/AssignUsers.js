import { useMemo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { keyBy } from 'lodash';

import { useStripes, Pluggable } from '@folio/stripes/core';

import { getUpdatedUserRoles, combineUserIds } from './utils';
import useRoleByUserIds from '../../../hooks/useRoleByUserIds';
import useUpdateUserRolesMutation from '../../../hooks/useUpdateUserRolesMutation';
import useAssignRolesToUserMutation from '../../../hooks/useAssignRolesToUserMutation';
import useDeleteUserRolesMutation from '../../../hooks/useDeleteUserRolesMutation';

const AssignUsers = ({ selectedUsers, roleId, refetch }) => {
  const stripes = useStripes();
  const { mutateUpdateUserRoles } = useUpdateUserRolesMutation();
  const { mutateAssignRolesToUser } = useAssignRolesToUserMutation();
  const { mutateDeleteUserRoles } = useDeleteUserRolesMutation();
  const [users, setUsers] = useState([]);
  const [isAssignUsers, setIsAssignUsers] = useState(false);

  const initialSelectedUsers = useMemo(() => keyBy(selectedUsers, 'id'), [selectedUsers]);
  const combinedUserIds = combineUserIds(Object.values(initialSelectedUsers).map(x => x.id), users.map(x => x.id));
  const { roleDetails, isSuccess } = useRoleByUserIds(combinedUserIds);

  const assignUsers = (newSelectedUsers) => {
    setIsAssignUsers(true);
    setUsers(newSelectedUsers);
  };

  useEffect(() => {
    (async () => {
      if (isAssignUsers && isSuccess) {
        const { added, removed } = getUpdatedUserRoles(Object.values(initialSelectedUsers).map(x => x.id), users.map(x => x.id));

        for (const userId of combinedUserIds) {
          const roleIds = [];

          roleDetails?.userRoles?.forEach(x => {
            if (x.userId === userId) {
              roleIds.push(x.roleId);
            }
          });

          if (roleIds?.length) {
            if (added?.includes(userId)) {
              roleIds.push(roleId);
            } else if (removed?.includes(userId)) {
              roleIds.splice(roleIds.indexOf(userId), 1);
            }
            // If modified, then PUT
            if ((added.includes(userId) || removed.includes(userId)) && roleIds.length) {
              await mutateUpdateUserRoles({ userId, roleIds });
              refetch();
            } else if (!roleIds.length) { // If no more capabilities, DELETE
              await mutateDeleteUserRoles({ userId });
              refetch();
            }
          } else { // if no matches, POST
            roleIds.push(roleId);
            await mutateAssignRolesToUser({ userId, roleIds });
            refetch();
          }
        }
      }
    })();
  }, [isSuccess, roleDetails, isAssignUsers]); // eslint-disable-line react-hooks/exhaustive-deps

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
