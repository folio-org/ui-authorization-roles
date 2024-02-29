import { useMutation, useQueryClient } from 'react-query';
import { useNamespace, useOkapiKy } from '@folio/stripes/core';

const useDeleteRoleMutation = (callback) => {
  const ky = useOkapiKy();
  const queryClient = useQueryClient();
  const [namespace] = useNamespace();
  const { mutateAsync, isLoading } = useMutation({
    mutationFn: (id) => ky.delete(`roles/${id}`).json(),
    onSuccess: async () => {
      await queryClient.invalidateQueries(namespace);
      callback();
    }
  });

  return { mutateAsync, isLoading };
};

export default useDeleteRoleMutation;


