import React from 'react';

import { combineUserIds, getUpdatedUserRoles } from './utils';


describe('RoleDetails utils', () => {
  it('should combine two arrays of IDs', () => {
    const result = combineUserIds(['1', '2'], ['3']);

    expect(result).toEqual(['1', '2', '3']);
  });

  it('should identify which IDs were added to an array', () => {
    const { added, removed } = getUpdatedUserRoles(['1', '2'], ['1', '2', '3']);

    expect(added).toEqual(['3']);
    expect(removed).toEqual([]);
  });

  it('should identify which IDs were removed from an array', () => {
    const { added, removed } = getUpdatedUserRoles(['1', '2', '3'], ['1', '3']);

    expect(added).toEqual([]);
    expect(removed).toEqual(['2']);
  });

  it('should identify which IDs were added and removed from an array', () => {
    const { added, removed } = getUpdatedUserRoles(['2', '3'], ['1', '3']);

    expect(added).toEqual(['1']);
    expect(removed).toEqual(['2']);
  });

  it('should handle empty arrays', () => {
    const { added, removed } = getUpdatedUserRoles([], []);

    expect(added).toEqual([]);
    expect(removed).toEqual([]);
  });
});
