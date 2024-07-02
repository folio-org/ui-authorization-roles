import {
  useMutation,
  useQueryClient,
} from 'react-query';

import {
  useNamespace,
  useOkapiKy,
  useStripes,
} from '@folio/stripes/core';

const useAssignRolesToUserMutation = (handleError) => {
  const stripes = useStripes();
  const ky = useOkapiKy();
  const queryClient = useQueryClient();
  const [namespace] = useNamespace();
  const { mutateAsync, isLoading } = useMutation({
    mutationFn: (newRole) => {
      stripes.logger.log('authz-roles', `creating role for ${newRole.userId}:: ${newRole.roleIds.join(', ')}`);
      return ky.post('roles/users', { json: newRole }).json();
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries(namespace);
    },
    onError: handleError,
  });

  return { mutateAssignRolesToUser: mutateAsync, isLoading };
};

export default useAssignRolesToUserMutation;


