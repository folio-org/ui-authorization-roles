export const extractSelectedIdsFromObject = (object) => Object.entries(object)
  .filter(([, isSelected]) => isSelected)
  .map(([id]) => id);
