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

    const userRoles = roleDetails?.userRoles || [];
    for (const userRole of userRoles) {
      if (userRole?.userId === userId) {
        roleIds.push(userRole.roleId);
      }
    }

    if (roleIds?.length) {
      if (added?.includes(userId)) {
        roleIds.push(roleId);
      } else if (removed?.includes(userId)) {
        roleIds.splice(roleIds.indexOf(userId), 1);
      }
      // If modified, then PUT
      if ((added.includes(userId) || removed.includes(userId)) && roleIds.length) {
        requests.push({ userId, roleIds, apiVerb: apiVerbs.PUT });
      } else if (!roleIds.length) { // If no more capabilities, DELETE
        requests.push({ userId, roleIds, apiVerb: apiVerbs.DELETE });
      }
    } else { // if no matches, POST
      roleIds.push(roleId);
      requests.push({ userId, roleIds, apiVerb: apiVerbs.POST });
    }
  }
  return requests;
}
