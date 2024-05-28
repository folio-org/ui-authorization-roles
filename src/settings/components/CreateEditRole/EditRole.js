import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { isEqual } from 'lodash';
import PropTypes from 'prop-types';

import CreateEditRoleForm from './CreateEditRoleForm';
import useCapabilities from '../../../hooks/useCapabilities';
import useRoleCapabilities from '../../../hooks/useRoleCapabilities';
import useEditRoleMutation from '../../../hooks/useEditRoleMutation';
import useRoleById from '../../../hooks/useRoleById';
import useApplicationCapabilities from '../../../hooks/useApplicationCapabilities';
import useRoleCapabilitySets from '../../../hooks/useRoleCapabilitySets';
import useCapabilitySets from '../../../hooks/useCapabilitySets';
import useSendErrorCallout from '../../../hooks/useErrorCallout';
import { getOnlyIntersectedWithApplicationsCapabilities } from '../../utils';

const EditRole = ({ path }) => {
  const history = useHistory();
  const { id: roleId } = useParams();

  const { roleDetails, isSuccess: isRoleDetailsLoaded } = useRoleById(roleId);

  const [roleName, setRoleName] = useState('');
  const [description, setDescription] = useState('');

  const { capabilitiesList, isLoading: isCapabilityListLoading } = useCapabilities();
  const { capabilitySetsList, isLoading: isCapabilitySetsLoading } = useCapabilitySets();
  const { initialRoleCapabilitiesSelectedMap, isSuccess: isInitialRoleCapabilitiesLoaded } = useRoleCapabilities(roleId);

  const { initialRoleCapabilitySetsSelectedMap,
    capabilitySetsCapabilities, isSuccess: isRoleCapabilitySetsLoaded } = useRoleCapabilitySets(roleId);

  const { checkedAppIdsMap,
    onSubmitSelectApplications,
    capabilities,
    selectedCapabilitiesMap,
    setSelectedCapabilitiesMap, roleCapabilitiesListIds,
    onInitialLoad,
    selectedCapabilitySetsMap,
    setSelectedCapabilitySetsMap,
    disabledCapabilities,
    setDisabledCapabilities,
    capabilitySets,
    roleCapabilitySetsListIds,
    isApplicationCapabilitiesLoading } = useApplicationCapabilities();

  const { sendErrorCallout } = useSendErrorCallout();

  const shouldUpdateCapabilities = !isEqual(initialRoleCapabilitiesSelectedMap, selectedCapabilitiesMap);
  const shouldUpdateCapabilitySets = !isEqual(initialRoleCapabilitySetsSelectedMap, selectedCapabilitySetsMap);

  const onChangeCapabilityCheckbox = (event, id) => {
    setSelectedCapabilitiesMap({ ...selectedCapabilitiesMap, [id]: event.target.checked });
  };

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

  const isCapabilityDisabled = id => !!disabledCapabilities[id];
  const isCapabilitySelected = (id) => !!selectedCapabilitiesMap[id] || isCapabilityDisabled(id);
  const isCapabilitySetSelected = id => !!selectedCapabilitySetsMap[id];

  useEffect(() => {
    if (isRoleDetailsLoaded && roleDetails) {
      setRoleName(roleDetails.name);
      setDescription(roleDetails.description);
    }
  }, [isRoleDetailsLoaded, roleDetails]);

  const onClose = () => history.push(`${path}/${roleId}`);

  const { mutateRole, isLoading } = useEditRoleMutation(
    { id: roleId, name: roleName, description },
    { roleCapabilitiesListIds, shouldUpdateCapabilities, roleCapabilitySetsListIds, shouldUpdateCapabilitySets },
    { handleError: sendErrorCallout }
  );

  const onSubmit = async (event) => {
    event.preventDefault();
    await mutateRole();
    onClose();
  };

  const isInitialDataReady = !isCapabilityListLoading && isRoleCapabilitySetsLoaded
  && isInitialRoleCapabilitiesLoaded && !isCapabilitySetsLoading;

  useEffect(() => {
    if (isInitialDataReady) {
      // After fetching all capabilities,capabilitySets, assigned to role capability ids,capability set ids
      // define define selected application ids
      const capabilitiesAppIds = getOnlyIntersectedWithApplicationsCapabilities(capabilitiesList, Object.keys(initialRoleCapabilitiesSelectedMap), 'applicationId');
      const capabilitySetAppIds = getOnlyIntersectedWithApplicationsCapabilities(capabilitySetsList, Object.keys(initialRoleCapabilitySetsSelectedMap), 'applicationId');
      onInitialLoad({ ...capabilitiesAppIds, ...capabilitySetAppIds });
      setSelectedCapabilitiesMap({ ...initialRoleCapabilitiesSelectedMap });
      setSelectedCapabilitySetsMap({ ...initialRoleCapabilitySetsSelectedMap });
      setDisabledCapabilities({ ...capabilitySetsCapabilities });
    }
    /* isInitialDataReady is enough to know if capabilities,capability sets fetched and can be settled safely to local state */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInitialDataReady]);

  return <CreateEditRoleForm
    title="ui-authorization-roles.crud.editRole"
    roleName={roleName}
    description={description}
    capabilities={capabilities}
    capabilitySets={capabilitySets}
    checkedAppIdsMap={checkedAppIdsMap}
    isLoading={isLoading}
    isCapabilitySelected={isCapabilitySelected}
    isCapabilityDisabled={isCapabilityDisabled}
    isCapabilitySetSelected={isCapabilitySetSelected}
    setRoleName={setRoleName}
    setDescription={setDescription}
    onSubmit={onSubmit}
    onClose={onClose}
    onChangeCapabilityCheckbox={onChangeCapabilityCheckbox}
    onChangeCapabilitySetCheckbox={onChangeCapabilitySetCheckbox}
    onSaveSelectedApplications={onSubmitSelectApplications}
    isCapabilitiesLoading={isApplicationCapabilitiesLoading || isCapabilityListLoading}
    isCapabilitySetsLoading={isApplicationCapabilitiesLoading || isCapabilitySetsLoading}
  />;
};

EditRole.propTypes = {
  path: PropTypes.string.isRequired
};

export default EditRole;
