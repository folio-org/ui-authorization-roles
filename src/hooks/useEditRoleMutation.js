import { useMutation, useQueryClient } from 'react-query';
import { useNamespace, useOkapiKy } from '@folio/stripes/core';

const useEditRoleMutation = ({ id, name, description }, roleCapabilitiesListIds, shouldUpdateCapabilities) => {
  const ky = useOkapiKy();
  const queryClient = useQueryClient();
  const [namespace] = useNamespace();
  const { mutateAsync, isLoading } = useMutation({
    mutationFn: () => ky.put(`roles/${id}`, { json: { name, description } }).json(),
    onSuccess: async () => {
      if (shouldUpdateCapabilities) {
        await ky.put(`roles/${id}/capabilities`, { json: { capabilityIds: roleCapabilitiesListIds } });
      }
      await queryClient.invalidateQueries(namespace);
    },
  });
  return { mutateRole: mutateAsync, isLoading };
};

export default useEditRoleMutation;


