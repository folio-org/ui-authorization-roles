import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useHistory, useLocation } from 'react-router';
import { isEqual, isEmpty } from 'lodash';

import CreateEditRoleForm from './CreateEditRoleForm';
import useCapabilities from '../../../hooks/useCapabilities';
import useRoleCapabilities from '../../../hooks/useRoleCapabilities';
import useEditRoleMutation from '../../../hooks/useEditRoleMutation';
import useRoleById from '../../../hooks/useRoleById';
import useApplicationCapabilities from '../../../hooks/useApplicationCapabilities';

const EditRole = ({ roleId }) => {
  const history = useHistory();
  const { pathname } = useLocation();
  const { roleDetails, isSuccess: isRoleDetailsLoaded } = useRoleById(roleId);

  const [roleName, setRoleName] = useState('');
  const [description, setDescription] = useState('');

  const { capabilitiesList, isSuccess: isCapabilitiesLoaded } = useCapabilities();
  const { initialRoleCapabilitiesSelectedMap } = useRoleCapabilities(roleId);
  const { checkedAppIdsMap,
    onSubmitSelectApplications,
    capabilities,
    selectedCapabilitiesMap,
    setSelectedCapabilitiesMap, roleCapabilitiesListIds, onInitialLoad } = useApplicationCapabilities();

  const shouldUpdateCapabilities = !isEqual(initialRoleCapabilitiesSelectedMap, selectedCapabilitiesMap);

  const onChangeCapabilityCheckbox = (event, id) => {
    setSelectedCapabilitiesMap({ ...selectedCapabilitiesMap, [id]: event.target.checked });
  };

  const isCapabilitySelected = (id) => !!selectedCapabilitiesMap[id];

  useEffect(() => {
    if (isRoleDetailsLoaded && roleDetails) {
      setRoleName(roleDetails.name);
      setDescription(roleDetails.description);
    }
  }, [isRoleDetailsLoaded, roleDetails]);

  const goBack = () => history.push(pathname);

  const { mutateRole, isLoading } = useEditRoleMutation({ id: roleId, name: roleName, description }, roleCapabilitiesListIds, shouldUpdateCapabilities);

  const onSubmit = async (event) => {
    event.preventDefault();
    await mutateRole();
    goBack();
  };

  useEffect(() => {
    if (!isEmpty(initialRoleCapabilitiesSelectedMap) && isCapabilitiesLoaded) {
      const appIds = capabilitiesList.filter(cap => Object.keys(initialRoleCapabilitiesSelectedMap).includes(cap.id))
        .reduce((acc, cap) => {
          if (!(cap.applicationId in acc)) {
            acc[cap.applicationId] = true;
          }
          return acc;
        }, {});
      onInitialLoad(appIds);
      setSelectedCapabilitiesMap(initialRoleCapabilitiesSelectedMap);
    }

    /* initialRoleCapabilitiesSelectedMap and isCapabilitiesLoaded is enough to know if initialCapabilitiesSelectedMap fetched and can be settled safely to local state */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialRoleCapabilitiesSelectedMap, isCapabilitiesLoaded]);

  return <CreateEditRoleForm
    title="ui-authorization-roles.crud.editRole"
    roleName={roleName}
    description={description}
    capabilities={capabilities}
    isCapabilitySelected={isCapabilitySelected}
    isLoading={isLoading}
    setRoleName={setRoleName}
    setDescription={setDescription}
    onSubmit={onSubmit}
    onClose={goBack}
    onChangeCapabilityCheckbox={onChangeCapabilityCheckbox}
    onSaveSelectedApplications={onSubmitSelectApplications}
    checkedAppIdsMap={checkedAppIdsMap}
  />;
};

EditRole.propTypes = {
  roleId: PropTypes.string
};

export default EditRole;
