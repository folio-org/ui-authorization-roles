import { useMemo, useEffect, useState } from 'react';
import { useQueryClient } from 'react-query'

import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { keyBy } from 'lodash';

import { useStripes, Pluggable } from '@folio/stripes/core';

import { apiVerbs, createUserRolesRequests, combineIds } from './utils';
import { USERS_BY_ROLE_ID_QUERY_KEY } from '../../../hooks/useUsersByRoleId';

import useRoleByUserIds from '../../../hooks/useRoleByUserIds';
import useUpdateUserRolesMutation from '../../../hooks/useUpdateUserRolesMutation';
import useAssignRolesToUserMutation from '../../../hooks/useAssignRolesToUserMutation';
import useDeleteUserRolesMutation from '../../../hooks/useDeleteUserRolesMutation';

const AssignUsers = ({ selectedUsers, roleId, refetch }) => {
  const stripes = useStripes();
  const queryClient = useQueryClient();

  const { mutateUpdateUserRoles } = useUpdateUserRolesMutation();
  const { mutateAssignRolesToUser } = useAssignRolesToUserMutation();
  const { mutateDeleteUserRoles } = useDeleteUserRolesMutation();
  const [users, setUsers] = useState([]);
  const [isAssignUsers, setIsAssignUsers] = useState(false);

  const initialSelectedUsers = useMemo(() => keyBy(selectedUsers, 'id'), [selectedUsers]);
  const combinedUserIds = combineIds(Object.values(initialSelectedUsers).map(x => x.id), users.map(x => x.id));
  const { roleDetails, isSuccess } = useRoleByUserIds(combinedUserIds);

  const assignUsers = (newSelectedUsers) => {
    setIsAssignUsers(true);
    setUsers(newSelectedUsers);
  };

  useEffect(() => {
    (async () => {
      if (isAssignUsers && isSuccess) {
        const requests = createUserRolesRequests(Object.values(initialSelectedUsers), users, roleId, roleDetails);
        const promises = [];

        for (const request of requests) {
          const { apiVerb, userId, roleIds } = request;
          switch (apiVerb) {
            case apiVerbs.PUT:
              promises.push(mutateUpdateUserRoles({ userId, roleIds }));
              break;
            case apiVerbs.POST:
              promises.push(mutateAssignRolesToUser({ userId, roleIds }));
              break;
            case apiVerbs.DELETE:
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
          setIsAssignUsers(false);
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
