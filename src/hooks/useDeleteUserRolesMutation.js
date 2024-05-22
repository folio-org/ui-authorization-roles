import { useMutation, useQueryClient } from 'react-query';
import { useNamespace, useOkapiKy, useStripes } from '@folio/stripes/core';

const useDeleteUserRolesMutation = (handleError) => {
  const stripes = useStripes();
  const ky = useOkapiKy();
  const queryClient = useQueryClient();
  const [namespace] = useNamespace();
  const { mutateAsync, isLoading } = useMutation({
    mutationFn: (newRole) => {
      stripes.logger.log('authz-roles', `removing roles for ${newRole.userId}`);
      return ky.delete(`roles/users/${newRole.userId}`).json();
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries(namespace);
    },
    onError: handleError,
  });

  return { mutateDeleteUserRoles: mutateAsync, isLoading };
};

export default useDeleteUserRolesMutation;


