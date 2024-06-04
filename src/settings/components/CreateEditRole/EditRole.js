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

const EditRole = ({ path }) => {
  const history = useHistory();
  const { id: roleId } = useParams();

  const { roleDetails, isSuccess: isRoleDetailsLoaded } = useRoleById(roleId);

  const [roleName, setRoleName] = useState('');
  const [description, setDescription] = useState('');

  const { capabilitiesList, isSuccess: isCapabilitiesLoaded } = useCapabilities();
  const { data: capabilitySetsData, isSuccess: isCapabilitySetsLoaded } = useCapabilitySets();
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
    isInitialLoaded } = useApplicationCapabilities();

  const { sendErrorCallout } = useSendErrorCallout();

  const shouldUpdateCapabilities = !isEqual(initialRoleCapabilitiesSelectedMap, selectedCapabilitiesMap);
  const shouldUpdateCapabilitySets = !isEqual(initialRoleCapabilitySetsSelectedMap, selectedCapabilitySetsMap);

  const onChangeCapabilityCheckbox = (event, id) => {
    setSelectedCapabilitiesMap({ ...selectedCapabilitiesMap, [id]: event.target.checked });
  };

  const onChangeCapabilitySetCheckbox = (event, capabilitySetId) => {
    const selectedCapabilitySet = capabilitySetsData.capabilitySets.find(cap => cap.id === capabilitySetId);
    if (!selectedCapabilitySet) return;

    const capabilitySetsCap = selectedCapabilitySet.capabilities.reduce((obj, item) => {
      obj[item] = event.target.checked;
      return obj;
    }, {});

    setDisabledCapabilities({ ...disabledCapabilities, ...capabilitySetsCap });
    setSelectedCapabilitySetsMap({ ...selectedCapabilitySetsMap, [capabilitySetId]: event.target.checked });
    setSelectedCapabilitiesMap({ ...selectedCapabilitiesMap, ...capabilitySetsCap });
  };

  const isCapabilitySelected = (id) => !!selectedCapabilitiesMap[id];
  const isCapabilitySetSelected = id => !!selectedCapabilitySetsMap[id];
  const isCapabilityDisabled = id => !!disabledCapabilities[id];

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

  useEffect(() => {
    if (capabilitiesList && isCapabilitiesLoaded && isRoleCapabilitySetsLoaded && isInitialRoleCapabilitiesLoaded && isCapabilitySetsLoaded) {
      const appIds = capabilitiesList?.filter(cap => Object.keys(initialRoleCapabilitiesSelectedMap).includes(cap.id))
        .reduce((acc, cap) => {
          if (!(cap.applicationId in acc)) {
            acc[cap.applicationId] = true;
          }
          return acc;
        }, {});
      onInitialLoad(appIds);
      setSelectedCapabilitiesMap({ ...initialRoleCapabilitiesSelectedMap, ...capabilitySetsCapabilities });
      setSelectedCapabilitySetsMap({ ...initialRoleCapabilitySetsSelectedMap });
      setDisabledCapabilities({ ...capabilitySetsCapabilities });
    }
    /* initialRoleCapabilitiesSelectedMap and isCapabilitiesLoaded is enough to know if initialCapabilitiesSelectedMap fetched and can be settled safely to local state */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [capabilitiesList, isCapabilitiesLoaded, isRoleCapabilitySetsLoaded, isCapabilitySetsLoaded, isInitialRoleCapabilitiesLoaded]);

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
    isCapabilitiesLoading={!isInitialLoaded}
    isCapabilitySetsLoading={!isInitialLoaded}
  />;
};

EditRole.propTypes = {
  path: PropTypes.string.isRequired
};

export default EditRole;
