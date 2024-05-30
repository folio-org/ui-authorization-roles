import React, { useState } from 'react';
import { useHistory } from 'react-router';
import PropTypes from 'prop-types';

import CreateEditRoleForm from './CreateEditRoleForm';
import useCreateRoleMutation from '../../../hooks/useCreateRoleMutation';
import useApplicationCapabilities from '../../../hooks/useApplicationCapabilities';
import useErrorCallout from '../../../hooks/useErrorCallout';
import useApplicationCapabilitySets from '../../../hooks/useApplicationCapabilitySets';

const CreateRole = ({ path }) => {
  const history = useHistory();

  const [roleName, setRoleName] = useState('');
  const [description, setDescription] = useState('');
  const [checkedAppIdsMap, setCheckedAppIdsMap] = useState({});
  const [disabledCapabilities, setDisabledCapabilities] = useState({});

  const { capabilities,
    selectedCapabilitiesMap,
    setSelectedCapabilitiesMap,
    roleCapabilitiesListIds,
    isLoading: isAppCapabilitiesLoading } = useApplicationCapabilities(checkedAppIdsMap);

  const { capabilitySets,
    selectedCapabilitySetsMap,
    setSelectedCapabilitySetsMap,
    roleCapabilitySetsListIds,
    capabilitySetsList,
    isLoading: isAppCapabilitySetsLoading } = useApplicationCapabilitySets(checkedAppIdsMap);

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
  /* disabled means that capability is included in the some of the capability set,
  and not interactively selected */
  const isCapabilitySelected = id => !!selectedCapabilitiesMap[id] || isCapabilityDisabled(id);

  const { mutateRole, isLoading } = useCreateRoleMutation(roleCapabilitiesListIds, roleCapabilitySetsListIds, sendErrorCallout);

  const onClose = () => history.push(path);

  const onSubmit = async (e) => {
    e.preventDefault();
    await mutateRole({ name: roleName, description });
    onClose();
  };

  const onSubmitSelectApplications = (appIds, onClose) => {
    onClose?.();
    setSelectedCapabilitiesMap({});
    setSelectedCapabilitySetsMap({});
    setDisabledCapabilities({});
    setCheckedAppIdsMap(appIds);
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
    isCapabilitiesLoading={isAppCapabilitiesLoading}
    isCapabilitySetsLoading={isAppCapabilitySetsLoading}
  />;
};

CreateRole.propTypes = {
  path: PropTypes.string.isRequired
};

export default CreateRole;
