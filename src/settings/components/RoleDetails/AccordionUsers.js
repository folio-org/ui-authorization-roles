import keyBy from 'lodash/keyBy';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  Badge,
  Loading,
  MultiColumnList,
  NoValue,
  TextLink,
} from '@folio/stripes/components';

import { getFullName } from '@folio/stripes/util';

import {
  useUsergroups,
  useUsersByRoleId,
} from '../../../hooks';
import AssignUsers from './AssignUsers';

const AccordionUsers = ({ roleId }) => {
  const { users, isLoading: usersIsLoading, refetch } = useUsersByRoleId(roleId, true);
  const { usergroups, isLoading: usergroupsIsLoading } = useUsergroups();

  if (usersIsLoading || usergroupsIsLoading) {
    return <Loading />;
  }

  const groupHash = keyBy(usergroups, 'id');

  users.sort((a, b) => {
    return getFullName(a).localeCompare(getFullName(b));
  });

  const usersData = users.map(i => {
    const fullName = (
      <TextLink to={`/users/preview/${i.id}?query=${i.username}`}>
        {getFullName(i)}
      </TextLink>
    );

    const patronGroup = groupHash[i.patronGroup]?.group || <NoValue />;

    return {
      fullName,
      patronGroup
    };
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
        refetch={refetch}
      />}
    >
      <MultiColumnList
        columnMapping={{
          fullName: <FormattedMessage id="ui-authorization-roles.role-details.accordion-users.columns.fullName" />,
          patronGroup: <FormattedMessage id="ui-authorization-roles.role-details.accordion-users.columns.patronGroup" />,
        }}
        contentData={usersData}
        visibleColumns={['fullName', 'patronGroup']}
      />
    </Accordion>
  );
};

AccordionUsers.propTypes = {
  roleId: PropTypes.string.isRequired
};

export default AccordionUsers;
