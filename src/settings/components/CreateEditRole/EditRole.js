import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useHistory, useLocation } from 'react-router';
import { isEqual, isEmpty } from 'lodash';

import CreateEditRoleForm from './CreateEditRoleForm';
import useCapabilities from '../../../hooks/useCapabilities';
import useRoleCapabilities from '../../../hooks/useRoleCapabilities';
import useEditRoleMutation from '../../../hooks/useEditRoleMutation';
import useRoleById from '../../../hooks/useRoleById';
import useApplicationCapabilities from '../../../hooks/useApplicationCapabilties';

const EditRole = ({ roleId }) => {
  const history = useHistory();
  const { pathname } = useLocation();
  const { roleDetails, isSuccess: isRoleDetailsLoaded } = useRoleById(roleId);

  const [roleName, setRoleName] = useState('');
  const [description, setDescription] = useState('');

  const { capabilitiesList } = useCapabilities();
  const { initialRoleCapabilitiesSelectedMap } = useRoleCapabilities(roleId);
  const [selectedCapabilitiesMap, setSelectedCapabilitiesMap] = useState({});
  const { checkedAppIdsMap, onSubmitSelectApplications } = useApplicationCapabilities();
  const [capabilities, setCapabilities] = useState({ data: [], procedural: [], settings: [] });

  const shouldUpdateCapabilities = !isEqual(initialRoleCapabilitiesSelectedMap, selectedCapabilitiesMap);

  const onChangeCapabilityCheckbox = (event, id) => {
    setSelectedCapabilitiesMap({ ...selectedCapabilitiesMap, [id]: event.target.checked });
  };

  const isCapabilitySelected = (id) => !!selectedCapabilitiesMap[id];

  useEffect(() => {
    if (isRoleDetailsLoaded && roleDetails) {
      setRoleName(roleDetails.name);
      setDescription(roleDetails.description);
    }
  }, [isRoleDetailsLoaded, roleDetails]);

  const goBack = () => history.push(pathname);

  const roleCapabilitiesListIds = useMemo(() => {
    return Object.entries(selectedCapabilitiesMap).filter(([, isSelected]) => isSelected).map(([id]) => id);
  }, [selectedCapabilitiesMap]);

  const { mutateRole, isLoading } = useEditRoleMutation({ id: roleId, name: roleName, description }, roleCapabilitiesListIds, shouldUpdateCapabilities);

  const onSubmit = async (event) => {
    event.preventDefault();
    await mutateRole();
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

  const onSaveSelectedApplications = (appIds, onClose) => onSubmitSelectApplications({ appIds, onClose, handleSelectedCapabilitiesOnChangeSelectedApplication, setCapabilities });

  useEffect(() => {
    if (!isEmpty(initialRoleCapabilitiesSelectedMap)) {
      const appIds = capabilitiesList.filter(cap => Object.keys(initialRoleCapabilitiesSelectedMap).includes(cap.id))
        .reduce((acc, cap) => {
          if (!(cap.applicationId in acc)) {
            acc[cap.applicationId] = true;
          }
          return acc;
        }, {});
      onSubmitSelectApplications({ appIds, setCapabilities });
      setSelectedCapabilitiesMap(initialRoleCapabilitiesSelectedMap);
    }
    /* initialRoleCapabilitiesSelectedMap is enough to know if initialCapabilitiesSelectedMap fetched and can be settled safely to local state */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialRoleCapabilitiesSelectedMap]);


  return <CreateEditRoleForm
    title="ui-authorization-roles.crud.editRole"
    roleName={roleName}
    description={description}
    capabilities={capabilities}
    isCapabilitySelected={isCapabilitySelected}
    isLoading={isLoading}
    setRoleName={setRoleName}
    setDescription={setDescription}
    onSubmit={onSubmit}
    onClose={goBack}
    onChangeCapabilityCheckbox={onChangeCapabilityCheckbox}
    onSaveSelectedApplications={onSaveSelectedApplications}
    checkedAppIdsMap={checkedAppIdsMap}
  />;
};

EditRole.propTypes = {
  roleId: PropTypes.string
};

export default EditRole;
