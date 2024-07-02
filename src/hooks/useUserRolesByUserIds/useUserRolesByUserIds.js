import { useChunkedCQLFetch } from '@folio/stripes/core';

/* Get list of user-roles by user IDs. That is, a list of roles assigned to the requested user IDs.
// The response shape is:
{
  "userRoles": [
    {
        "userId": "<USER_ID>",
        "roleId": "<ROLE_ID>",
        "metadata": {
            "createdDate": "<UTC_DATETIME>",
            "createdBy": "<USER_ID>"
        }
    },
    ...
  ]
}
*/

export const chunkedUserRolesReducer = (list) => (
  list.reduce((acc, cur) => {
    return [...acc, ...(cur?.data?.userRoles ?? [])];
  }, []));

function useUserRolesByUserIds(userIds) {
  const {
    isLoading,
    items: userRolesResponse
  } = useChunkedCQLFetch({
    endpoint: 'roles/users',
    ids: userIds,
    idName: 'userId',
    reduceFunction: chunkedUserRolesReducer
  });

  return { userRolesResponse, isLoading };
}

export default useUserRolesByUserIds;
