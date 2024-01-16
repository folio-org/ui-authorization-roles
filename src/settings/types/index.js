import PropTypes from 'prop-types';

export const capabilitiesPropType = PropTypes.arrayOf(
  PropTypes.shape({
    id: PropTypes.string.isRequired,
    description: PropTypes.string,
    resource: PropTypes.string.isRequired,
    applicationId: PropTypes.string.isRequired,
    actions: PropTypes.object
  })
);
