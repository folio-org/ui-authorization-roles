import React from 'react';

import { combineIds, getSelectedIdsDifference, createUserRolesRequests, apiVerbs } from './utils';

describe('RoleDetails utils', () => {
  describe('combineIds', () => {
    it('should combine two arrays of IDs', () => {
      const result = combineIds(['1', '2'], ['3']);

      expect(result).toEqual(['1', '2', '3']);
    });

    it('should handle empty primary array', () => {
      const result = combineIds(null, ['3']);

      expect(result).toEqual(['3']);
    });

    it('should handle empty secondary array', () => {
      const result = combineIds(['3']);

      expect(result).toEqual(['3']);
    });
  });

  describe('getSelectedIdsDifference', () => {
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
  });

  describe('Create Roles API requests', () => {
    it('should create correct Roles API requests', async () => {
      const qc = {
        fetchQuery: jest.fn()
          .mockResolvedValueOnce()
          .mockResolvedValueOnce({ userRoles: [{ roleId: '111' }] })
          .mockResolvedValueOnce({ userRoles: [] })
          .mockResolvedValueOnce({ userRoles: [{ roleId: '111' }, { roleId: '555' }] })
      };

      const requests = await createUserRolesRequests(
        [
          { id: '1' }, // will be removed via DELETE because fetchQuery mock 3 is empty so the user will have no roles
          { id: '2' }, // will be removed via PUT because fetchQuery mock 4 is empty so the user will have no roles
        ],
        [
          { id: '3' }, // will be added via POST because fetchQuery mock 1 is empty so this user will have one role
          { id: '4' }, // will be added via PUT because fetchQuery mock 2 contains a role so this user will have two roles
        ],
        '555',
        qc,
        jest.fn(),
      );

      expect(requests).toEqual([
        { apiVerb: apiVerbs.POST, roleIds: ['555'], userId: '3' },
        { apiVerb: apiVerbs.PUT, roleIds: ['111', '555'], userId: '4' },
        { apiVerb: apiVerbs.DELETE, roleIds: [], userId: '1' },
        { apiVerb: apiVerbs.PUT, roleIds: ['111'], userId: '2' },
      ]);
    });

    it('should handle no change', async () => {
      const qc = {};

      const requests = await createUserRolesRequests(
        [{ id: '2' }, { id: '3' }],
        [{ id: '2' }, { id: '3' }],
        '555',
        qc,
        jest.fn(),
      );

      expect(requests.length).toEqual(0);
    });
  });
});
