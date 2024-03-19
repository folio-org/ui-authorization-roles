import { extractSelectedIdsFromObject } from './filtering';

describe('test filtering functions', () => {
  it('test extractSelectedIdsFromObject', () => {
    const selectedIdsMap = { 'alpha': true, 'betta': false, 'gamma': true };

    expect(extractSelectedIdsFromObject(selectedIdsMap)).toStrictEqual(['alpha', 'gamma']);

    const selectedIdsMap2 = { '1': true, '2': false, '3': true, '4': false, '5': true, '6': false, '7': false };
    expect(extractSelectedIdsFromObject(selectedIdsMap2)).toStrictEqual(['1', '3', '5']);
  });
});
