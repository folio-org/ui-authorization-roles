import { useMutation, useQueryClient } from 'react-query';
import { useNamespace, useOkapiKy } from '@folio/stripes/core';

const useEditRoleMutation = ({ id, name, description }, { roleCapabilitiesListIds, shouldUpdateCapabilities, shouldUpdateCapabilitySets, roleCapabilitySetsListIds }) => {
  const ky = useOkapiKy();
  const queryClient = useQueryClient();
  const [namespace] = useNamespace();
  const { mutateAsync, isLoading } = useMutation({
    mutationFn: () => ky.put(`roles/${id}`, { json: { name, description } }).json(),
    onSuccess: async () => {
      if (shouldUpdateCapabilities) {
        await ky.put(`roles/${id}/capabilities`, { json: { capabilityIds: roleCapabilitiesListIds } });
      }
      if (shouldUpdateCapabilitySets) {
        await ky.put(`roles/${id}/capability-sets`, { json: { capabilitySetIds: roleCapabilitySetsListIds } });
      }
      await queryClient.invalidateQueries(namespace);
    },
    onError:(error) => window.alert(JSON.stringify(error)) // eslint-disable-line no-alert
  });
  return { mutateRole: mutateAsync, isLoading };
};

export default useEditRoleMutation;


