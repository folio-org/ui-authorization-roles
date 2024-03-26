import { useMutation, useQuery, useQueryClient } from 'react-query';
import { differenceBy, unionBy } from 'lodash';

import { useNamespace, useOkapiKy, useStripes } from '@folio/stripes/core';

import { apiVerbs, createUserRolesRequests, combineIds } from '../settings/components/RoleDetails/utils';
import useUsersByRoleId, { USERS_BY_ROLE_ID_QUERY_KEY } from './useUsersByRoleId';

import useUserRolesByUserIds from './useUserRolesByUserIds';
import useUpdateUserRolesMutation from './useUpdateUserRolesMutation';
import useAssignRolesToUserMutation from './useAssignRolesToUserMutation';
import useDeleteUserRolesMutation from './useDeleteUserRolesMutation';

export function getSelectedIdsDifference(prevIds = [], newIds = []) {
  const added = differenceBy(newIds, prevIds);
  const removed = differenceBy(prevIds, newIds);

  return { added, removed };
}

const useRoleSetUsers = (roleId) => {
  const ky = useOkapiKy();
  const stripes = useStripes();

  const { mutateUpdateUserRoles } = useUpdateUserRolesMutation();
  const { mutateAssignRolesToUser } = useAssignRolesToUserMutation();
  const { mutateDeleteUserRoles } = useDeleteUserRolesMutation();

  const queryClient = useQueryClient();
  const [namespace] = useNamespace();

  const { users, isLoading: usersIsLoading, refetch } = useUsersByRoleId(roleId, true);


  // const { mutateAsync, isLoading } = useMutation({
  //   mutationFn: (newRole) => ky.delete(`roles/users/${newRole.userId}`).json(),
  //   onSuccess: async () => {
  //     await queryClient.invalidateQueries(namespace);
  //   },
  //   onError: (error) => console.error(JSON.stringify(error)) // eslint-disable-line no-console
  // });

  // // retrieve user-role records for this role
  // const { data, isSuccess } = useQuery(
  //   [namespace, id],
  //   () => ky.get(`roles/users?limit=${stripes.config.maxUnpagedResourceCount}&query=roleId==${id}`).json(),
  //   {
  //     enabled: !!id,
  //   }
  // );

  // Given previously selected users, currently selected users, role ID and role details
  // (including other roles assigned to that user), create appropriate API request to add to queue
  const createUserRolesRequests = (previousSelectedUsers, currentSelectedUsers) => {
    const requests = [];
    const previousUserIds = previousSelectedUsers.map(x => x.id);
    const currentUserIds = currentSelectedUsers.map(x => x.id);
    const { added, removed } = getSelectedIdsDifference(previousUserIds, currentUserIds);

    // console.log(JSON.stringify({ added, removed }, null, 2))
    // console.log(JSON.stringify({ users }, null, 2))

    // user-roles are fun! fun fun fun!
    // user-roles are shaped like { userId, roleId }, which makes them look
    // like a simple join between users and roles but it's not quite that simple.
    // the API hides a complex structure behind the scenes that makes user-role
    // manipulation somewhat fraught.
    //
    // The /roles/users/${userId} API will return 200 but empty for a user who
    // has never had a role assigned but will return 200 { userRoles: [] } for a
    // user who had roles once but doesn't any longer.
    const rolesForUser = (userId) => {
      return users
        .filter(i => i.userId === userId)
        .map(i => i.roleId);
    };

    for (const userId of added) {
      const roleIds = rolesForUser(userId); console.log({ userId, roleIds })
      console.log(JSON.stringify({ action: 'ADD', userId, roleIds }, null, 2))
      const apiVerb = roleIds.length ? apiVerbs.PUT : apiVerbs.POST;
      requests.push({ userId, roleIds: [...roleIds, roleId], apiVerb });
    }

    for (const userId of removed) {
      const roleIds = rolesForUser(userId).filter(id => id !== roleId);
      console.log(JSON.stringify({ action: 'REM', userId, roleIds }, null, 2))
      const apiVerb = roleIds.length > 0 ? apiVerbs.PUT : apiVerbs.DELETE;
      requests.push({ userId, roleIds, apiVerb });
    }

    return requests;
  };

  const roleSetUsers = (pList, cList) => {
    console.log({ roleId, pList, cList });
    if (!usersIsLoading) {
      const requests = createUserRolesRequests(pList, cList);
      console.log(requests);

    } else {
      console.log('usersIsLoading');
    }
    // const combinedUserIds = combineIds(Object.values(initialSelectedUsers).map(x => x.id), users.map(x => x.id));
    // const { userRolesResponse, isLoading } = useUserRolesByUserIds(combinedUserIds);
  };

  const isLoading = false;

  return { roleSetUsers, isLoading };
};

export default useRoleSetUsers;
