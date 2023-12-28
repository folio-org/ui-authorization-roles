import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useHistory, useLocation } from 'react-router';

import useCapabilities from '../../../hooks/useCapabilities';
import useRoleCapabilities from '../../../hooks/useRoleCapabilities';

import CreateEditRoleForm from './CreateEditRoleForm';

import { getKeyBasedArrayGroup } from '../../utils';
import { useEditRoleMutation } from '../../../hooks/useEditRoleMutation';

const EditRole = ({ selectedRole }) => {
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

  const { mutateAsync, isLoading } = useEditRoleMutation({ name: roleName, description });

  const onSubmit = async (event) => {
    event.preventDefault();
    await mutateAsync(selectedRole.id);
    goBack();
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
