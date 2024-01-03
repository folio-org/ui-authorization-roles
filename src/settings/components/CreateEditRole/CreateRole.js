import React, { useCallback, useMemo, useState } from 'react';
import { useHistory, useLocation } from 'react-router';

import useCapabilities from '../../../hooks/useCapabilities';
import CreateEditRoleForm from './CreateEditRoleForm';
import useCreateRoleMutation from '../../../hooks/useCreateRoleMutation';

const CreateRole = () => {
  const history = useHistory();
  const { pathname } = useLocation();

  const [roleName, setRoleName] = useState('');
  const [description, setDescription] = useState('');

  const { groupedCapabilitiesByType } = useCapabilities();
  const [selectedCapabilitiesMap, setSelectedCapabilitiesMap] = useState({});

  const onChangeCapabilityCheckbox = useCallback((event, id) => {
    setSelectedCapabilitiesMap({ ...selectedCapabilitiesMap, [id]: event.target.checked });
  }, [selectedCapabilitiesMap]);

  const isCapabilitySelected = (id) => !!selectedCapabilitiesMap[id];

  const roleCapabilitiesListIds = useMemo(() => {
    return Object.entries(selectedCapabilitiesMap).filter(([, isSelected]) => isSelected).map(([id]) => id);
  }, [selectedCapabilitiesMap]);

  const { mutateRole, isLoading } = useCreateRoleMutation(roleCapabilitiesListIds);

  const goBack = () => history.push(pathname);

  const onSubmit = async (e) => {
    e.preventDefault();
    await mutateRole({ name:roleName, description });
    goBack();
  };

  return <CreateEditRoleForm
    title="ui-authorization-roles.crud.createRole"
    roleName={roleName}
    description={description}
    isLoading={isLoading}
    capabilities={groupedCapabilitiesByType}
    isCapabilitySelected={isCapabilitySelected}
    setRoleName={setRoleName}
    setDescription={setDescription}
    onSubmit={onSubmit}
    onClose={goBack}
    onChangeCapabilityCheckbox={onChangeCapabilityCheckbox}
    selectedCapabilitiesMap={selectedCapabilitiesMap}
  />;
};

export default CreateRole;
