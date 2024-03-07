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
export function createUserRolesRequests(previousSelectedUsers, currentSelectedUsers, roleId, roleDetails) {
  const requests = [];
  const previousSelectedUserIds = previousSelectedUsers.map(x => x.id);
  const currentSelectedUserIds = currentSelectedUsers.map(x => x.id);
  const combinedUserIds = combineIds(previousSelectedUserIds, currentSelectedUserIds);
  const { added, removed } = getSelectedIdsDifference(previousSelectedUserIds, currentSelectedUserIds);

  for (const userId of combinedUserIds) {
    const roleIds = [];

    for (const userRole of roleDetails) {
      if (userRole?.userId === userId) {
        roleIds.push(userRole.roleId);
      }
    }

    // We are determining here which users were selected or deselected for this role.
    if (roleIds?.length) {
      // If user is added to role
      if (added?.includes(userId) && !roleIds.includes(roleId)) {
        roleIds.push(roleId);
      // If user is removed from role
      } else if (removed?.includes(userId)) {
        roleIds.splice(roleIds.indexOf(roleId), 1);
      }
      // If user has at least one other role besides this one, then we are updating an existing userRoles entry.
      if ((added.includes(userId) || removed.includes(userId)) && roleIds.length) {
        requests.push({ userId, roleIds, apiVerb: apiVerbs.PUT });
      // If user has no more roles, then we are deleting the userRoles entry.
      } else if (!roleIds.length) {
        requests.push({ userId, roleIds, apiVerb: apiVerbs.DELETE });
      }
    // If the user previously had no roles assigned, then we are creating a userRoles entry.
    } else if (added?.includes(userId)) {
      roleIds.push(roleId);
      requests.push({ userId, roleIds, apiVerb: apiVerbs.POST });
    }
  }
  return requests;
}
