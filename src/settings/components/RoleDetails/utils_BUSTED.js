import { differenceBy, unionBy } from 'lodash';

export const apiVerbs = Object.freeze({
  GET: Symbol('get'),
  POST: Symbol('post'),
  PUT: Symbol('put'),
  DELETE: Symbol('delete')
});

export function combineIds(prevIds = [], newIds = []) {
  return unionBy(prevIds, newIds);
}

export function getSelectedIdsDifference(prevIds = [], newIds = []) {
  const added = differenceBy(newIds, prevIds);
  const removed = differenceBy(prevIds, newIds);

  return { added, removed };
}

// Given previously selected users, currently selected users, role ID and role details
// (including other roles assigned to that user), create appropriate API request to add to queue
export async function createUserRolesRequests(previousSelectedUsers, currentSelectedUsers, roleId, userRolesResponse, queryClient, ky) {
  const requests = [];
  const previousUserIds = previousSelectedUsers.map(x => x.id);
  const currentUserIds = currentSelectedUsers.map(x => x.id);
  const { added, removed } = getSelectedIdsDifference(previousUserIds, currentUserIds);

  console.log(JSON.stringify({ added, removed }, null, 2))
  console.log(JSON.stringify({ userRolesResponse }, null, 2))

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
    return userRolesResponse
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
}
