import { ROLES_ENDPOINT } from './endpoints';

describe('Endpoints', () => {
  it('test roles endpoint with given search term', () => {
    expect(ROLES_ENDPOINT('searchTest')).toBe(
      'roles?limit=1000&query=name=*searchTest*'
    );
  });

  it('test roles endpoint without search term', () => {
    expect(ROLES_ENDPOINT()).toBe('roles?limit=1000&query=cql.allRecords=1');
  });
});
