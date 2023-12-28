import { useMutation, useQueryClient } from 'react-query';
import { useOkapiKy } from '@folio/stripes/core';

export const useEditRoleMutation = (newRole) => {
  const ky = useOkapiKy();
  const queryClient = useQueryClient();
  const { mutateAsync, isLoading } = useMutation({
    mutationFn: (roleId) => ky.put(`roles/${roleId}`, { json: newRole }).json(),
    onSuccess: async () => {
      await queryClient.invalidateQueries('ui-authorization-roles');
    }
  });
  return { mutateRole: mutateAsync, isLoading };
};


