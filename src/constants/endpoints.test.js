import { ROLES_ENDPOINT } from './endpoints';

describe('Endpoints', () => {
  it('test roles endpoint without search term', () => {
    expect(ROLES_ENDPOINT(1000)).toMatch(/roles\?limit=1000&query=cql.allRecords=1/);
  });
});
