import { groupById, getKeyBasedArrayGroup } from './grouping';

describe('Test grouping functions', () => {
  it('test groupById', () => {
    const data = [{ id: '1', name: 'Cohen' }, { id: '2', name: 'Newman' }];

    expect(groupById(data)).toEqual({ '1': { id: '1', name: 'Cohen' },
      '2':{ id: '2', name: 'Newman' } });
  });

  it('test getKeyBasedArrayGroup', () => {
    const data = [{ id: 1, name: 'Cohen', type: 'get' },
      { id: 2, name: 'Oscar', type: 'get' },
      { id: 3, name: 'Wally', type: 'post' },
      { id: 4, name: 'Rally', type: 'post' },
      { id: 5, name: 'Nolan', type: 'put' }
    ];

    expect(getKeyBasedArrayGroup(data, 'type')).toEqual({
      'get': [
        { id: 1, name: 'Cohen', type: 'get' },
        { id: 2, name: 'Oscar', type: 'get' }],
      'post': [
        { id: 3, name: 'Wally', type: 'post' },
        { id: 4, name: 'Rally', type: 'post' }],
      'put': [{ id: 5, name: 'Nolan', type: 'put' }]
    });
  });
});
