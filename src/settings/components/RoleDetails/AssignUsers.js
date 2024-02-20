import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { useStripes, Pluggable } from '@folio/stripes/core';

const AssignUsers = ({ roleId }) => {
  const stripes = useStripes();
  const assignUsers = (users) => {
    console.log(users);
  };

  let initialSelectedUsers = [];

  return (
    <Pluggable
      aria-haspopup="true"
      dataKey="assignUsers"
      id="clickable-plugin-assign-users"
      searchButtonStyle="default"
      searchLabel={<FormattedMessage id="ui-authorization-roles.assignUnassign" />}
      stripes={stripes}
      type="find-user"
      selectUsers={assignUsers}
      initialSelectedUsers={initialSelectedUsers}
    >
      <FormattedMessage id="ui-users.permissions.assignUsers.actions.assign.notAvailable" />
    </Pluggable>
  );
};

AssignUsers.propTypes = {
  roleId: PropTypes.string.isRequired
};

export default AssignUsers;
