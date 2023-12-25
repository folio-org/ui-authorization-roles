import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useHistory, useLocation } from 'react-router';
import { useMutation, useQueryClient } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import useCapabilities from '../../../hooks/useCapabilities';
import useRoleCapabilities from '../../../hooks/useRoleCapabilities';

import CreateEditRoleForm from './CreateEditRoleForm';

import { getKeyBasedArrayGroup } from '../../utils';

const EditRole = ({ selectedRole }) => {
  const ky = useOkapiKy();

  const history = useHistory();
  const { pathname } = useLocation();

  const [roleName, setRoleName] = useState('');
  const [description, setDescription] = useState('');

  const { capabilitiesList } = useCapabilities();
  const { initialRoleCapabilitiesSelectedMap, isSuccess: isRoleCapabilitiesFetched } = useRoleCapabilities(selectedRole?.id);
  const [selectedCapabilitiesMap, setSelectedCapabilitiesMap] = useState({});

  useEffect(() => {
    if (isRoleCapabilitiesFetched) {
      setSelectedCapabilitiesMap(initialRoleCapabilitiesSelectedMap);
    }
    /* if add initialRoleCapabilitiesSelectedMap in deps re-renders happens running forever, */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRoleCapabilitiesFetched, selectedRole]);

  const onChangeCapabilityCheckbox = (event, id) => {
    setSelectedCapabilitiesMap({ ...selectedCapabilitiesMap, [id]: event.target.checked });
  };

  const groupedCapabilitiesByType = useMemo(() => {
    return getKeyBasedArrayGroup(capabilitiesList, 'type');
  }, [capabilitiesList]);

  const isCapabilitySelected = (id) => !!selectedCapabilitiesMap[id];

  useEffect(() => {
    if (selectedRole) {
      setRoleName(selectedRole.name);
      setDescription(selectedRole.description);
    }
  }, [selectedRole]);

  const goBack = () => history.push(pathname);

  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation({
    mutationFn: (roleId) => ky.put(`roles/${roleId}`, { json: { name:roleName, description } }).json(),
    onSuccess: async () => {
      await queryClient.invalidateQueries('ui-authorization-roles');
      goBack();
    }
  });

  const onSubmit = async (event) => {
    event.preventDefault();
    mutate(selectedRole.id);
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
  selectedRole: PropTypes.object
};

export default EditRole;
