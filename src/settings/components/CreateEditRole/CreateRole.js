import React, { useCallback, useMemo, useState } from 'react';
import { useHistory, useLocation } from 'react-router';

import { useOkapiKy } from '@folio/stripes/core';

import { useMutation, useQueryClient } from 'react-query';
import { getKeyBasedArrayGroup } from '../../utils';
import useCapabilities from '../../../hooks/useCapabilities';
import CreateEditRoleForm from './CreateEditRoleForm';

const CreateRole = () => {
  const ky = useOkapiKy();
  const queryClient = useQueryClient();

  const history = useHistory();
  const { pathname } = useLocation();

  const [roleName, setRoleName] = useState('');
  const [description, setDescription] = useState('');

  const { capabilitiesList } = useCapabilities();
  const [selectedCapabilitiesMap, setSelectedCapabilitiesMap] = useState({});

  const onChangeCapabilityCheckbox = useCallback((event, id) => {
    setSelectedCapabilitiesMap({ ...selectedCapabilitiesMap, [id]: event.target.checked });
  }, [selectedCapabilitiesMap]);

  const groupedCapabilitiesByType = useMemo(() => {
    return getKeyBasedArrayGroup(capabilitiesList, 'type');
  }, [capabilitiesList]);

  const isCapabilitySelected = (id) => selectedCapabilitiesMap[id];

  const roleCapabilitiesListIds = useMemo(() => {
    return Object.entries(selectedCapabilitiesMap).filter(([, isSelected]) => isSelected).map(([id]) => id);
  }, [selectedCapabilitiesMap]);

  const goBack = () => history.push(pathname);

  const mutation = useMutation({
    mutationFn: (newRole) => ky.post('roles', { json: newRole }).json(),
    onSuccess: async (newRole) => {
      await queryClient.invalidateQueries('ui-authorization-roles');
      if (roleCapabilitiesListIds.length > 0) {
        await ky.post('roles/capabilities', { json: { roleId:newRole.id, capabilityIds: roleCapabilitiesListIds } }).json();
      }
      goBack();
    }
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    mutation.mutate({ name:roleName, description });
  };

  return <CreateEditRoleForm
    title="ui-authorization-roles.crud.createRole"
    roleName={roleName}
    description={description}
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
