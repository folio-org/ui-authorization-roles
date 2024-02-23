import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useHistory, useLocation } from 'react-router';
import { isEqual } from 'lodash';

import CreateEditRoleForm from './CreateEditRoleForm';
import useCapabilities from '../../../hooks/useCapabilities';
import useRoleCapabilities from '../../../hooks/useRoleCapabilities';
import useEditRoleMutation from '../../../hooks/useEditRoleMutation';
import useRoleById from '../../../hooks/useRoleById';
import useApplicationCapabilities from '../../../hooks/useApplicationCapabilities';
import useRoleCapabilitySets from '../../../hooks/useRoleCapabilitySets';
import useCapabilitySets from '../../../hooks/useCapabilitySets';

const EditRole = ({ roleId }) => {
  const history = useHistory();
  const { pathname } = useLocation();
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
    roleCapabilitySetsListIds } = useApplicationCapabilities();

  const shouldUpdateCapabilities = !isEqual(initialRoleCapabilitiesSelectedMap, selectedCapabilitiesMap);
  const shouldUpdateCapabilitySets = !isEqual(initialRoleCapabilitySetsSelectedMap, selectedCapabilitiesMap);

  const onChangeCapabilityCheckbox = (event, id) => {
    setSelectedCapabilitiesMap({ ...selectedCapabilitiesMap, [id]: event.target.checked });
  };

  const onChangeCapabilitySetCheckbox = (event, capabilitySetId) => {
    const selectedCapabilitySet = capabilitySetsData.capabilitySets.find(cap => cap.id === capabilitySetId);

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

  const goBack = () => history.push(pathname);

  const { mutateRole, isLoading } = useEditRoleMutation({ id: roleId, name: roleName, description }, { roleCapabilitiesListIds, shouldUpdateCapabilities, roleCapabilitySetsListIds, shouldUpdateCapabilitySets });

  const onSubmit = async (event) => {
    event.preventDefault();
    await mutateRole();
    goBack();
  };

  useEffect(() => {
    if (isCapabilitiesLoaded && isRoleCapabilitySetsLoaded && isInitialRoleCapabilitiesLoaded && isCapabilitySetsLoaded) {
      const appIds = capabilitiesList.filter(cap => Object.keys(initialRoleCapabilitiesSelectedMap).includes(cap.id))
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
  }, [isCapabilitiesLoaded, isRoleCapabilitySetsLoaded, isCapabilitySetsLoaded]);

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
    onClose={goBack}
    onChangeCapabilityCheckbox={onChangeCapabilityCheckbox}
    onChangeCapabilitySetCheckbox={onChangeCapabilitySetCheckbox}
    onSaveSelectedApplications={onSubmitSelectApplications}
  />;
};

EditRole.propTypes = {
  roleId: PropTypes.string
};

export default EditRole;
