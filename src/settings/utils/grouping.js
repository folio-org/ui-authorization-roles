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

const groupTypeCapabilityByResource = (data) => Object.entries(data).reduce((acc, [type, capabilities]) => {
  if (!acc[type]) {
    acc[type] = {};
  }
  acc[type] = capabilities.reduce((initial, capability) => {
    if (!initial[capability.resource]) {
      initial[capability.resource] = [];
    }
    initial[capability.resource].push(capability);

    return initial;
  }, {});

  return acc;
}, {});

const groupCapabilitiesObjectByTypeAndResource = (groupedTypeByResource) => {
  const dataType = [];
  const proceduralType = [];
  const settingsType = [];

  Object.entries(groupedTypeByResource).forEach(([type, capabilities]) => {
    Object.entries(capabilities).forEach(([resource, cap]) => {
      const actionsObject = cap.reduce((acc, item) => {
        acc[item.action] = item.id;
        return acc;
      }, {});
      if (type === 'data') {
        dataType.push({ id: cap[0].id, applicationId: cap[0].applicationId, resource, actions: actionsObject });
      } else if (type === 'procedural') {
        proceduralType.push({ id: cap[0].id, applicationId: cap[0].applicationId, resource, actions: actionsObject });
      } else if (type === 'settings') {
        settingsType.push({ id: cap[0].id, applicationId: cap[0].applicationId, resource, actions: actionsObject });
      }
    });
  });
  const result = {};

  if (dataType.length) {
    result.data = dataType;
  }
  if (proceduralType.length) {
    result.procedural = proceduralType;
  }
  if (settingsType.length) {
    result.settings = settingsType;
  }

  return result;
};

/**
 * Groups the data by resource.
 *
 * @param {Object} data - The data to be grouped.
 * @returns {Object} - The grouped data.
 */
export const getCapabilitiesGroupedByTypeAndResource = (data) => {
  const typeBasedGroupCapabilities = getKeyBasedArrayGroup(data, 'type');
  const typesGroupedByResource = groupTypeCapabilityByResource(typeBasedGroupCapabilities);

  return groupCapabilitiesObjectByTypeAndResource(typesGroupedByResource);
};
export const groupById = (arr) => {
  return arr.reduce((acc, value) => {
    acc[value.id] = value;

    return acc;
  }, {});
};
