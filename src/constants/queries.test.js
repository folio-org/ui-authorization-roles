import { likeSearch } from './queries';

describe('Queries utils', () => {
  it('test like search', () => {
    expect(likeSearch('searchTest')).toBe('*searchTest*');
  });
});
