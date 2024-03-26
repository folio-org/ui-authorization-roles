/**
 * The code extracts the ids of thuthy items from an object.
 * It filters through the object's key-value pairs, keeping only those where the value is truthy (indicating selection),
 * and then maps these pairs to extract and return the keys (ids) of the thuthy items.
 *
 * @param {Object} object - object, {[key: string]: boolean} shape
 *
 * @returns {Array} - array of thuthy keys of input object
 */

export const extractSelectedIdsFromObject = (object) => Object.entries(object)
  .filter(([, isSelected]) => isSelected)
  .map(([id]) => id);
