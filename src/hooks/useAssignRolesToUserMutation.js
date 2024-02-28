import { useMutation, useQueryClient } from 'react-query';
import { useNamespace, useOkapiKy } from '@folio/stripes/core';

const useAssignRolesToUserMutation = () => {
  const ky = useOkapiKy();
  const queryClient = useQueryClient();
  const [namespace] = useNamespace();
  const { mutateAsync, isLoading } = useMutation({
    mutationFn: (newRole) => ky.post('roles/users', { json: newRole }).json(),
    onSuccess: async () => {
      await queryClient.invalidateQueries(namespace);
    }
  });

  return { mutateAssignRolesToUser: mutateAsync, isLoading };
};

export default useAssignRolesToUserMutation;


