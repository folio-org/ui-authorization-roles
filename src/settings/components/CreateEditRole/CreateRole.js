import React, { useState } from 'react';
import { useHistory, useLocation } from 'react-router';

import CreateEditRoleForm from './CreateEditRoleForm';
import useCreateRoleMutation from '../../../hooks/useCreateRoleMutation';
import useApplicationCapabilities from '../../../hooks/useApplicationCapabilities';

const CreateRole = () => {
  const history = useHistory();
  const { pathname } = useLocation();

  const [roleName, setRoleName] = useState('');
  const [description, setDescription] = useState('');

  const { checkedAppIdsMap,
    onSubmitSelectApplications,
    capabilities,
    selectedCapabilitiesMap,
    setSelectedCapabilitiesMap, roleCapabilitiesListIds,
    selectedCapabilitySetsMap,
    setSelectedCapabilitySetsMap,
    disabledCapabilities,
    setDisabledCapabilities,
    capabilitySets,
    capabilitySetsList, roleCapabilitySetsListIds } = useApplicationCapabilities();

  const onChangeCapabilityCheckbox = (event, id) => setSelectedCapabilitiesMap({ ...selectedCapabilitiesMap, [id]: event.target.checked });
  const onChangeCapabilitySetCheckbox = (event, capabilitySetId) => {
    const selectedCapabilitySet = capabilitySetsList.find(cap => cap.id === capabilitySetId);
    const capabilitySetsCap = selectedCapabilitySet.capabilities.reduce((obj, item) => {
      obj[item] = event.target.checked;
      return obj;
    }, {});

    setDisabledCapabilities({ ...disabledCapabilities, ...capabilitySetsCap });
    setSelectedCapabilitySetsMap({ ...selectedCapabilitySetsMap, [capabilitySetId]: event.target.checked });
    setSelectedCapabilitiesMap({ ...selectedCapabilitiesMap, ...capabilitySetsCap });
  };

  const isCapabilitySelected = id => !!selectedCapabilitiesMap[id];
  const isCapabilitySetSelected = id => !!selectedCapabilitySetsMap[id];
  const isCapabilityDisabled = id => !!disabledCapabilities[id];

  const { mutateRole, isLoading } = useCreateRoleMutation(roleCapabilitiesListIds, roleCapabilitySetsListIds);

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
    capabilities={capabilities}
    capabilitySets={capabilitySets}
    isCapabilityDisabled={isCapabilityDisabled}
    isCapabilitySetSelected={isCapabilitySetSelected}
    isCapabilitySelected={isCapabilitySelected}
    setRoleName={setRoleName}
    setDescription={setDescription}
    onSubmit={onSubmit}
    onClose={goBack}
    onChangeCapabilityCheckbox={onChangeCapabilityCheckbox}
    onChangeCapabilitySetCheckbox={onChangeCapabilitySetCheckbox}
    selectedCapabilitiesMap={selectedCapabilitiesMap}
    onSaveSelectedApplications={onSubmitSelectApplications}
    checkedAppIdsMap={checkedAppIdsMap}
  />;
};

export default CreateRole;
