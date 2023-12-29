import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useHistory, useLocation } from 'react-router';

import useCapabilities from '../../../hooks/useCapabilities';
import useRoleCapabilities from '../../../hooks/useRoleCapabilities';

import CreateEditRoleForm from './CreateEditRoleForm';

import { getKeyBasedArrayGroup } from '../../utils';
import { useEditRoleMutation } from '../../../hooks/useEditRoleMutation';
import useRoleById from '../../../hooks/useRoleById';

const EditRole = ({ roleId }) => {
  const history = useHistory();
  const { pathname } = useLocation();
  const { roleDetails, isRoleDetailsLoaded } = useRoleById(roleId);

  const [roleName, setRoleName] = useState('');
  const [description, setDescription] = useState('');

  const { capabilitiesList } = useCapabilities();
  const { initialRoleCapabilitiesSelectedMap, isSuccess: isRoleCapabilitiesFetched } = useRoleCapabilities(roleId);
  const [selectedCapabilitiesMap, setSelectedCapabilitiesMap] = useState({});

  useEffect(() => {
    if (isRoleCapabilitiesFetched) {
      setSelectedCapabilitiesMap(initialRoleCapabilitiesSelectedMap);
    }
    /* isRoleCapabilitiesFetched is enough to know if initialCapabilitiesSelectedMap fetched and can be settled safely to local state */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRoleCapabilitiesFetched, roleId]);

  const onChangeCapabilityCheckbox = (event, id) => {
    setSelectedCapabilitiesMap({ ...selectedCapabilitiesMap, [id]: event.target.checked });
  };

  const groupedCapabilitiesByType = useMemo(() => {
    return getKeyBasedArrayGroup(capabilitiesList, 'type');
  }, [capabilitiesList]);

  const isCapabilitySelected = (id) => !!selectedCapabilitiesMap[id];

  useEffect(() => {
    if (isRoleDetailsLoaded && roleDetails) {
      setRoleName(roleDetails.name);
      setDescription(roleDetails.description);
    }
  }, [isRoleDetailsLoaded, roleDetails]);

  const goBack = () => history.push(pathname);

  const roleCapabilitiesListIds = useMemo(() => {
    return Object.entries(selectedCapabilitiesMap).filter(([, isSelected]) => isSelected).map(([id]) => id);
  }, [selectedCapabilitiesMap]);

  const { mutateRole, isLoading } = useEditRoleMutation({ id: roleId, name: roleName, description }, roleCapabilitiesListIds);

  const onSubmit = async (event) => {
    event.preventDefault();
    await mutateRole();
    goBack();
  };

  return <CreateEditRoleForm
    title="ui-authorization-roles.crud.editRole"
    roleName={roleName}
    description={description}
    capabilities={groupedCapabilitiesByType}
    isCapabilitySelected={isCapabilitySelected}
    isLoading={isLoading}
    setRoleName={setRoleName}
    setDescription={setDescription}
    onSubmit={onSubmit}
    onClose={goBack}
    onChangeCapabilityCheckbox={onChangeCapabilityCheckbox}
  />;
};

EditRole.propTypes = {
  roleId: PropTypes.string
};

export default EditRole;
