export const getKeyBasedArrayGroup = (array, key) => {
  return array.reduce((acc, currentObject) => {
    const keyValue = currentObject[key];
    if (!acc[keyValue]) {
      acc[keyValue] = [];
    }
    acc[keyValue].push(currentObject);

    return acc;
  }, {});
};
export const groupById = (arr) => {
  return arr.reduce((acc, value) => {
    acc[value.id] = value;

    return acc;
  }, {});
};
