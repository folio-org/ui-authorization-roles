import PropTypes from 'prop-types';

export const capabilitiesPropType = PropTypes.arrayOf(
  PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    resource: PropTypes.string.isRequired,
    action: PropTypes.string.isRequired,
    applicationId: PropTypes.string.isRequired,
    permissions: PropTypes.arrayOf(PropTypes.string).isRequired,
    type: PropTypes.string.isRequired,
    directParentIds: PropTypes.arrayOf(PropTypes.string).isRequired,
    allParentIds: PropTypes.arrayOf(PropTypes.string).isRequired,
    metadata: PropTypes.shape({
      createdDate: PropTypes.string.isRequired,
      modifiedDate: PropTypes.string.isRequired,
    }).isRequired,
    actions: PropTypes.shape({
      view: PropTypes.bool.isRequired,
      edit: PropTypes.bool.isRequired,
      create: PropTypes.bool.isRequired,
      delete: PropTypes.bool.isRequired,
      manage: PropTypes.bool.isRequired,
    }).isRequired,
  })
);
