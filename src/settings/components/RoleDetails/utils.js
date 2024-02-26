import { differenceBy, unionBy } from 'lodash';

export function combineUserIds(prevUserIds = [], newUserIds = []) {
  return unionBy(prevUserIds, newUserIds);
} 

export function getUpdatedUserRoles(prevUserRoles = [], newUserRoles = []) {
  const added = differenceBy(newUserRoles, prevUserRoles);
  const removed = differenceBy(prevUserRoles, newUserRoles);

  return { added, removed };
}