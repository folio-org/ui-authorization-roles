import { allRecords, likeSearch } from './queries';

export const ROLES_ENDPOINT = (searchTerm, limit = 1000) => {
  if (!searchTerm) {
    return `roles?limit=${limit}&query=${allRecords}`;
  }
  return `roles?limit=${limit}&query=name=${likeSearch(encodeURIComponent(searchTerm))}`;
};
