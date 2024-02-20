import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  Badge,
  List,
  Loading,
  TextLink,
} from '@folio/stripes/components';

import { getFullName } from '@folio/stripes/util';

import useUsersByRoleId from '../../../hooks/useUsersByRoleId';
import AssignUsers from './AssignUsers';

const userFormatter = (i) => (
  <li key={i.id}>
    <TextLink to={`/users/preview/${i.id}?query=${i.username}`}>
      {getFullName(i)}
    </TextLink>
  </li>
);

const AccordionUsers = ({ roleId }) => {
  const { users, isLoading } = useUsersByRoleId(roleId, true);
  if (isLoading) {
    return <Loading />;
  }

  users.sort((a, b) => {
    return getFullName(a).localeCompare(getFullName(b));
  });

  return (
    <Accordion
      label={
        <FormattedMessage id="ui-authorization-roles.assignedUsers" />
      }
      displayWhenClosed={
        <Badge>
          {users?.length || 0}
        </Badge>
      }
      displayWhenOpen={<AssignUsers
        selectedUsers={users}

      />}
    >
      <List
        items={users}
        itemFormatter={userFormatter}
      />
    </Accordion>
  );
};

AccordionUsers.propTypes = {
  roleId: PropTypes.string.isRequired
};

export default AccordionUsers;
