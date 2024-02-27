import React from 'react';

import { combineIds, getSelectedIdsDifference, createUserRolesRequests, apiVerbs } from './utils';

describe('RoleDetails utils', () => {
  it('should combine two arrays of IDs', () => {
    const result = combineIds(['1', '2'], ['3']);

    expect(result).toEqual(['1', '2', '3']);
  });

  it('should identify which IDs were added to an array', () => {
    const { added, removed } = getSelectedIdsDifference(['1', '2'], ['1', '2', '3']);

    expect(added).toEqual(['3']);
    expect(removed).toEqual([]);
  });

  it('should identify which IDs were removed from an array', () => {
    const { added, removed } = getSelectedIdsDifference(['1', '2', '3'], ['1', '3']);

    expect(added).toEqual([]);
    expect(removed).toEqual(['2']);
  });

  it('should identify which IDs were added and removed from an array', () => {
    const { added, removed } = getSelectedIdsDifference(['2', '3'], ['1', '3']);

    expect(added).toEqual(['1']);
    expect(removed).toEqual(['2']);
  });

  it('should handle empty arrays', () => {
    const { added, removed } = getSelectedIdsDifference([], []);

    expect(added).toEqual([]);
    expect(removed).toEqual([]);
  });

  describe('Create Roles API requests', () => {
    it('should create correct Roles API requests', () => {
      const requests = createUserRolesRequests([{ id: '1' }], [{ id: '2' }, { id: '3' }], '555', { userRoles: [{ userId: '1', roleId: '555' }, { userId: '3', roleId: '111' }] });

      expect(requests).toEqual([
        { apiVerb: apiVerbs.DELETE, roleIds: [], userId: '1' },
        { apiVerb: apiVerbs.POST, roleIds: ['555'], userId: '2' },
        { apiVerb: apiVerbs.PUT, roleIds: ['111', '555'], userId: '3' }
      ]);
    });

    it('should handle no change', () => {
      const requests = createUserRolesRequests([{ id: '1' }], [{ id: '1' }], '555', { userRoles: [{ userId: '1', roleId: '555' }] });

      expect(requests.length).toEqual(0);
    });
  });
});
