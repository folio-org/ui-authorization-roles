import React, { useCallback, useMemo, useState } from 'react';
import { useHistory, useLocation } from 'react-router';

import { isEmpty } from 'lodash';
import CreateEditRoleForm from './CreateEditRoleForm';
import useCreateRoleMutation from '../../../hooks/useCreateRoleMutation';
import useApplicationCapabilities from '../../../hooks/useApplicationCapabilties';

const CreateRole = () => {
  const history = useHistory();
  const { pathname } = useLocation();

  const [roleName, setRoleName] = useState('');
  const [description, setDescription] = useState('');

  const [selectedCapabilitiesMap, setSelectedCapabilitiesMap] = useState({});
  const { checkedAppIdsMap, onSubmitSelectApplications } = useApplicationCapabilities();
  const [capabilities, setCapabilities] = useState({ data: [], settings: [], procedural: [] });

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

  const handleSelectedCapabilitiesOnChangeSelectedApplication = (applicationCaps) => {
    if (isEmpty(applicationCaps)) {
      setSelectedCapabilitiesMap({});
      return;
    }

    const intersectedCapabilityValues = applicationCaps.filter(cap => roleCapabilitiesListIds.includes(cap.id))
      .reduce((acc, cap) => {
        acc[cap.id] = true;
        return acc;
      }, {});

    setSelectedCapabilitiesMap(intersectedCapabilityValues);
  };

  const onSaveSelectedApplications = (appIds, onClose) => onSubmitSelectApplications({ appIds, onClose, setCapabilities, handleSelectedCapabilitiesOnChangeSelectedApplication });

  return <CreateEditRoleForm
    title="ui-authorization-roles.crud.createRole"
    roleName={roleName}
    description={description}
    isLoading={isLoading}
    capabilities={capabilities}
    isCapabilitySelected={isCapabilitySelected}
    setRoleName={setRoleName}
    setDescription={setDescription}
    onSubmit={onSubmit}
    onClose={goBack}
    onChangeCapabilityCheckbox={onChangeCapabilityCheckbox}
    selectedCapabilitiesMap={selectedCapabilitiesMap}
    onSaveSelectedApplications={onSaveSelectedApplications}
    checkedAppIdsMap={checkedAppIdsMap}
  />;
};

export default CreateRole;
