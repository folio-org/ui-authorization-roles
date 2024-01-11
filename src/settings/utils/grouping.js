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
/**
 * Group type by resource
 *
 * @param {Object} groupedTypeByResource
 * returns capabilities object grouped by type, e.g.
 * {data: [], settings: [], procedural: []}
 *
 * @returns {Object} - Returns grouped data by resource,
 * {data: { Accounts Collection:[
    {
        "id": "09d65820-79ea-4ae4-8d01-e1b6eaf0dbd0",
        "name": "accounts_collection.view",
        "description": "Get a list of account records",
        "resource": "Accounts Collection",
        "action": "view",
        "applicationId": "app-platform-complete-0.0.2",
        "type": "data",
    }
],
  procedural: {Accounts Cancel:[
    {
        "id": "1f7cb8c4-fc41-44c5-ac29-09a48e82eadf",
        "name": "accounts_cancel.execute",
        "description": "Cancels an account",
        "resource": "Accounts Cancel",
        "action": "execute",
        "applicationId": "app-platform-complete-0.0.2",
        "type": "procedural",
    },
    {
        "id": "238c4-fc41-44c5-23-19348e8443",
        "name": "accounts_cancel.execute",
        "description": "Save an account",
        "resource": "Accounts Cancel",
        "action": "execute",
        "applicationId": "app-platform-minimal-1.0.0",
        "type": "procedural",
    }
  ]},
   settings: {...},
 *  }}
 *
 */
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


/**
 * Groups the data by resource.
 *
 * @param {Object} groupedTypeByResource - return value of groupTypeCapabilityByResource
 *
 * There might be capabilities with the same resource and different actions, each of them represented by separate item.
 * The function groups capabilities by resource, e.g. for the same resource and different actions returns single object.
 *
 * @returns {Object} - returns capabilities grouped by type -> application -> resource
 *
 */
const groupCapabilitiesObjectByTypeAndResource = (groupedTypeByResource) => {
  const result = {
    data: [],
    procedural: [],
    settings: []
  };

  Object.entries(groupedTypeByResource).forEach(([type, capabilities]) => {
    Object.entries(capabilities).forEach(([resource, cap]) => {
      const capabilitiesByApplication = cap.reduce((acc, value) => {
        if (!acc[value.applicationId]) {
          acc[value.applicationId] = [value];
        } else {
          acc[value.applicationId] = [...acc[value.applicationId], value];
        }
        return acc;
      }, {});

      // Push to result[type] only single row with appropriate application and resource;
      // example of pushed value - {applicationId: 111, resource: "resource 1", action: {view: "222", edit: "333", manage: "444"}}
      Object.entries(capabilitiesByApplication).forEach(([application, resourceCapabilities]) => {
        result[type].push({ id: resourceCapabilities[0].id,
          applicationId: application,
          resource,
          actions: resourceCapabilities.reduce((acc, item) => {
            acc[item.action] = item.id;
            return acc;
          }, {}) });
      });
    });
  });

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
