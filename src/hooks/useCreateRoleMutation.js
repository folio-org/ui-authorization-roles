import { useMutation, useQueryClient } from 'react-query';
import { useOkapiKy } from '@folio/stripes/core';

export const useCreateRoleMutation = (roleCapabilitiesListIds) => {
  const ky = useOkapiKy();
  const queryClient = useQueryClient();
  const { mutateAsync, isLoading } = useMutation({
    mutationFn: (newRole) => ky.post('roles', { json: newRole }).json(),
    onSuccess: async (newRole) => {
      await queryClient.invalidateQueries('ui-authorization-roles');
      if (roleCapabilitiesListIds.length > 0) {
        await ky.post('roles/capabilities', { json: { roleId:newRole.id, capabilityIds: roleCapabilitiesListIds } }).json();
      }
    }
  });

  return { mutateRole: mutateAsync, isLoading };
};


