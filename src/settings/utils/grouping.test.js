import { groupById, getKeyBasedArrayGroup, getCapabilitiesGroupedByTypeAndResource } from './grouping';

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

  it('test getCapabilitiesGroupedByTypeAndResource', () => {
    const capabilities = [
      { id: 1, applicationId: 'app1', type: 'data', resource: 'resource1', action: 'edit' },
      { id: 2, applicationId: 'app1', type: 'data', resource: 'resource1', action: 'create' },
      { id: 22, applicationId: 'ccc', type: 'data', resource: 'resource1', action: 'manage' },
      { id: 222, applicationId: 'ccc', type: 'data', resource: 'resource1', action: 'delete' },
      { id: 3, applicationId: 'app1', type: 'data', resource: 'resource1', action: 'delete' },
      { id: 4, applicationId: 'app1', type: 'data', resource: 'resource1', action: 'manage' },
      { id: 5, applicationId: 'app1', type: 'settings', resource: 'resource2', action: 'edit' },
      { id: 6, applicationId: 'app1', type: 'settings', resource: 'resource2', action: 'delete' },
      { id: 7, applicationId: 'app1', type: 'procedural', resource: 'resource3', action: 'execute' },
      { id: 8, applicationId: 'app1', type: 'procedural', resource: 'resource1', action: 'execute' },
      { id: 9, applicationId: 'bbb', type: 'procedural', resource: 'resource3', action: 'execute' },
      { id: 10, applicationId: 'bbb', type: 'procedural', resource: 'resource3', action: 'delete' },
    ];

    const expected = {
      data: [{ id: 1, applicationId: 'app1', resource: 'resource1', actions: { edit: 1, create: 2, delete: 3, manage: 4 } },
        { id: 22, applicationId: 'ccc', resource: 'resource1', actions: { manage: 22, delete: 222 } },
      ],
      settings: [{ id: 5, applicationId: 'app1', resource: 'resource2', actions: { edit: 5, delete: 6 } }],
      procedural: [
        { id: 7, applicationId: 'app1', resource: 'resource3', actions: { execute: 7 } },
        { id: 8, applicationId: 'app1', resource: 'resource1', actions: { execute: 8 } },
        { id: 9, applicationId: 'bbb', resource: 'resource3', actions: { execute: 9, delete: 10 } },
      ]
    };

    expect(getCapabilitiesGroupedByTypeAndResource(capabilities)).toEqual(expected);
  });
});
