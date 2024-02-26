import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { keyBy } from 'lodash';

import {
  Accordion,
  Badge,
  Loading,
  MultiColumnList,
  NoValue,
  TextLink,
} from '@folio/stripes/components';

import { getFullName } from '@folio/stripes/util';

import useUsersByRoleId from '../../../hooks/useUsersByRoleId';
import useUsergroups from '../../../hooks/useUsergroups';
import AssignUsers from './AssignUsers';

const AccordionUsers = ({ roleId }) => {
  const { users, isLoading: usersIsLoading } = useUsersByRoleId(roleId, true);
  const { usergroups, isLoading: usergroupsIsLoading } = useUsergroups();

  if (usersIsLoading || usergroupsIsLoading) {
    return <Loading />;
  }

  const groupHash = keyBy(usergroups, 'id');

  users.sort((a, b) => {
    return getFullName(a).localeCompare(getFullName(b));
  });

  users.forEach(i => {
    i.fullName = (
      <TextLink to={`/users/preview/${i.id}?query=${i.username}`}>
        {getFullName(i)}
      </TextLink>
    );
    i.patronGroup = groupHash[i.patronGroup]?.desc || <NoValue />;
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
        roleId={roleId}
      />}
    >
      <MultiColumnList
        columnMapping={{
          fullName: <FormattedMessage id="ui-authorization-roles.role-details.accordion-users.columns.fullName" />,
          patronGroup: <FormattedMessage id="ui-authorization-roles.role-details.accordion-users.columns.patronGroup" />,
        }}
        contentData={users}
        visibleColumns={['fullName', 'patronGroup']}
      />
    </Accordion>
  );
};

AccordionUsers.propTypes = {
  roleId: PropTypes.string.isRequired
};

export default AccordionUsers;
