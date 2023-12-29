import { useMutation, useQueryClient } from 'react-query';
import { useOkapiKy } from '@folio/stripes/core';

export const useEditRoleMutation = ({ id, name, description }, roleCapabilitiesListIds) => {
  const ky = useOkapiKy();
  const queryClient = useQueryClient();
  const { mutateAsync, isLoading } = useMutation({
    mutationFn: () => ky.put(`roles/${id}`, { json: { name, description } }).json(),
    onSuccess: async () => {
      await queryClient.invalidateQueries('ui-authorization-roles');
      await queryClient.invalidateQueries(['role-data', id]);
      if (roleCapabilitiesListIds.length > 0) {
        await ky.post('roles/capabilities', { json: { roleId: id, capabilityIds: roleCapabilitiesListIds } }).json();
      }
    }
  });
  return { mutateRole: mutateAsync, isLoading };
};


