import { allRecords } from './queries';

export const ROLES_ENDPOINT = (limit) => `roles?limit=${limit}&query=${allRecords} sortby name`;
