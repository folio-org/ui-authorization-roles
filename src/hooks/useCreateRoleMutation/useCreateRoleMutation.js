import { useMutation, useQueryClient } from 'react-query';
import { useNamespace, useOkapiKy } from '@folio/stripes/core';

const useCreateRoleMutation = (roleCapabilitiesListIds, capabilitySetListIds, handleError) => {
  const ky = useOkapiKy();
  const queryClient = useQueryClient();
  const [namespace] = useNamespace();
  const { mutateAsync, isLoading } = useMutation({
    mutationFn: (newRole) => ky.post('roles', { json: newRole }).json(),
    onSuccess: async (newRole) => {
      await queryClient.invalidateQueries(namespace);
      if (roleCapabilitiesListIds.length > 0) {
        await ky.post('roles/capabilities', { json: { roleId: newRole.id, capabilityIds: roleCapabilitiesListIds } }).json();
      }
      if (capabilitySetListIds.length > 0) {
        await ky.post('roles/capability-sets', { json: { roleId: newRole.id, capabilitySetIds: capabilitySetListIds } }).json();
      }
    },
    onError: handleError,
  });

  return { mutateRole: mutateAsync, isLoading };
};

export default useCreateRoleMutation;


