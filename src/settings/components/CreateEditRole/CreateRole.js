import React, { useState } from 'react';
import { useHistory } from 'react-router';
import PropTypes from 'prop-types';

import CreateEditRoleForm from './CreateEditRoleForm';
import useCreateRoleMutation from '../../../hooks/useCreateRoleMutation';
import useApplicationCapabilities from '../../../hooks/useApplicationCapabilities';
import useErrorCallout from '../../../hooks/useErrorCallout';

const CreateRole = ({ path }) => {
  const history = useHistory();

  const [roleName, setRoleName] = useState('');
  const [description, setDescription] = useState('');

  const { checkedAppIdsMap,
    onSubmitSelectApplications,
    capabilities,
    selectedCapabilitiesMap,
    setSelectedCapabilitiesMap,
    roleCapabilitiesListIds,
    selectedCapabilitySetsMap,
    setSelectedCapabilitySetsMap,
    disabledCapabilities,
    setDisabledCapabilities,
    capabilitySets,
    capabilitySetsList,
    roleCapabilitySetsListIds,
    isInitialLoaded } = useApplicationCapabilities();

  const { sendErrorCallout } = useErrorCallout();

  const onChangeCapabilityCheckbox = (event, id) => setSelectedCapabilitiesMap({ ...selectedCapabilitiesMap, [id]: event.target.checked });
  const onChangeCapabilitySetCheckbox = (event, capabilitySetId) => {
    const selectedCapabilitySet = capabilitySetsList.find(cap => cap.id === capabilitySetId);
    if (!selectedCapabilitySet) return;

    const capabilitySetsCap = selectedCapabilitySet.capabilities.reduce((obj, item) => {
      obj[item] = event.target.checked;
      return obj;
    }, {});

    setDisabledCapabilities({ ...disabledCapabilities, ...capabilitySetsCap });
    setSelectedCapabilitySetsMap({ ...selectedCapabilitySetsMap, [capabilitySetId]: event.target.checked });
  };

  const isCapabilitySetSelected = id => !!selectedCapabilitySetsMap[id];
  const isCapabilityDisabled = id => !!disabledCapabilities[id];
  const isCapabilitySelected = id => !!selectedCapabilitiesMap[id] || isCapabilityDisabled(id);

  const { mutateRole, isLoading } = useCreateRoleMutation(roleCapabilitiesListIds, roleCapabilitySetsListIds, sendErrorCallout);

  const onClose = () => history.push(path);

  const onSubmit = async (e) => {
    e.preventDefault();
    await mutateRole({ name: roleName, description });
    onClose();
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
    onClose={onClose}
    onChangeCapabilityCheckbox={onChangeCapabilityCheckbox}
    onChangeCapabilitySetCheckbox={onChangeCapabilitySetCheckbox}
    selectedCapabilitiesMap={selectedCapabilitiesMap}
    onSaveSelectedApplications={onSubmitSelectApplications}
    checkedAppIdsMap={checkedAppIdsMap}
    isCapabilitiesLoading={!isInitialLoaded}
    isCapabilitySetsLoading={!isInitialLoaded}
  />;
};

CreateRole.propTypes = {
  path: PropTypes.string.isRequired
};

export default CreateRole;
