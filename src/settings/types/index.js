import PropTypes from 'prop-types';

export const capabilitiesPropType = PropTypes.arrayOf(
  PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    resource: PropTypes.string.isRequired,
    action: PropTypes.string.isRequired,
    applicationId: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    metadata: PropTypes.shape({
      createdDate: PropTypes.string,
      modifiedDate: PropTypes.string,
    }),
  })
);
