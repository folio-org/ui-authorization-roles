import { useMutation, useQueryClient } from 'react-query';
import { useOkapiKy } from '@folio/stripes/core';

const useEditRoleMutation = ({ id, name, description }, roleCapabilitiesListIds) => {
  const ky = useOkapiKy();
  const queryClient = useQueryClient();
  const { mutateAsync, isLoading } = useMutation({
    mutationFn: () => ky.put(`roles/${id}`, { json: { name, description } }).json(),
    onSuccess: async () => {
      await ky.put(`roles/${id}/capabilities`, { json: { capabilityIds: roleCapabilitiesListIds } });
      await queryClient.invalidateQueries('ui-authorization-roles');
      await queryClient.invalidateQueries(['role-data', id]);
    },
  });
  return { mutateRole: mutateAsync, isLoading };
};

export default useEditRoleMutation;


