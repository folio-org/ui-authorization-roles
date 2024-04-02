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


/**
 * createUserRolesRequests
 * Given lists of previous-selections and current-selections, calculate
 * the diff to figure out which users are being added to the role and which
 * are being removed. For each user, retrieve their currently assigned roles
 * in order to figure out what kind of update to perform. Generate a list of
 * requests to perform and return it.
 *
 * List mgmt: given lists like
 *     prev: A B C D
 *     curr:     C D E F
 * (prev - curr) yields users to remove (A, B)
 * (curr - prev) yields users to add (E, F)
 * We don't care about the intersection (C, D); those users are not changing.
 * A user being removed who has no other roles will generate a DELETE request.
 * A user being added who has no other roles will generate a POST request.
 * Other operations generate PUT requests with an updated list of roles.
 *
 * The implementation here is ... awkward. Although we have a hook to retrieve
 * all user-roles given a list of users, it is hook-based and what we really
 * need here is to synchronously await the completion of those queries and
 * then run these queries. Instead, this function eschews that data in favor
 * of retrieving each user's roles individually. That potentially means A LOT
 * more queries, but I just couldn't bend my brain around how to leverage
 * useUserRolesByUserIds in an event-handler, which is what we need. I'm sure
 * there's a way (some combination of setting the query to be disabled and
 * then using refetch?), but I'm out of time to figure out how. That's elegant
 * but I couldn't make it work; this is inelegant but it works. Grrrrrr.
 *
 * @param {*} previousSelectedUsers previous members
 * @param {*} currentSelectedUsers current members
 * @param {*} roleId ID of role whose membership is changing
 * @param {*} queryClient react-query.queryClient
 * @param {*} ky okapiKy instance
 * @returns
 */
export async function createUserRolesRequests(previousSelectedUsers, currentSelectedUsers, roleId, queryClient, ky) {
  const requests = [];
  const previousUserIds = previousSelectedUsers.map(x => x.id);
  const currentUserIds = currentSelectedUsers.map(x => x.id);
  const { added, removed } = getSelectedIdsDifference(previousUserIds, currentUserIds);

  // user-roles are fun! fun fun fun!
  // user-roles are shaped like { userId, roleId }, which makes them look
  // like a simple join between users and roles but it's not quite that simple.
  // the API hides a complex structure behind the scenes that makes user-role
  // manipulation somewhat fraught.
  //
  // The /roles/users/${userId} API will return 200 but empty for a user who
  // has never had a role assigned but will return 200 { userRoles: [] } for a
  // user who had roles once but doesn't any longer.
  const rolesForUser = async (userId) => {
    const data = await queryClient.fetchQuery(
      `role-${roleId}-user-${userId}`,
      () => ky.get(`roles/users/${userId}`).json()
    );

    let roles = [];
    if (data?.userRoles) {
      roles = data.userRoles.map(i => i.roleId);
    }

    return roles;
  };

  for (const userId of added) {
    const roleIds = await rolesForUser(userId);
    // console.log(JSON.stringify({ action: 'ADD', userId, roleIds }, null, 2))
    const apiVerb = roleIds.length ? apiVerbs.PUT : apiVerbs.POST;
    requests.push({ userId, roleIds: [...roleIds, roleId], apiVerb });
  }

  for (const userId of removed) {
    const roleIds = (await rolesForUser(userId)).filter(id => id !== roleId);
    // console.log(JSON.stringify({ action: 'REM', userId, roleIds }, null, 2))
    const apiVerb = roleIds.length > 0 ? apiVerbs.PUT : apiVerbs.DELETE;
    requests.push({ userId, roleIds, apiVerb });
  }

  return requests;
}
