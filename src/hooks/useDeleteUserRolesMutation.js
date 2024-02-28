import { useMutation, useQueryClient } from 'react-query';
import { useNamespace, useOkapiKy } from '@folio/stripes/core';

const useDeleteUserRolesMutation = () => {
  const ky = useOkapiKy();
  const queryClient = useQueryClient();
  const [namespace] = useNamespace();
  const { mutateAsync, isLoading } = useMutation({
    mutationFn: (newRole) => ky.delete(`roles/users/${newRole.userId}`).json(),
    onSuccess: async () => {
      await queryClient.invalidateQueries(namespace);
    }
  });

  return { mutateDeleteUserRoles: mutateAsync, isLoading };
};

export default useDeleteUserRolesMutation;


