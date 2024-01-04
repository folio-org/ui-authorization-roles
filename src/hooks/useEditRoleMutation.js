import { useMutation, useQueryClient } from 'react-query';
import { useNamespace, useOkapiKy } from '@folio/stripes/core';

const useEditRoleMutation = ({ id, name, description }, roleCapabilitiesListIds) => {
  const ky = useOkapiKy();
  const queryClient = useQueryClient();
  const [namespace] = useNamespace({ key: 'ui-authorization-roles' });
  // const [roleDataNamespace] = useNamespace({ key: 'ui-authorization-roles:role-data' });
  const { mutateAsync, isLoading } = useMutation({
    mutationFn: () => ky.put(`roles/${id}`, { json: { name, description } }).json(),
    onSuccess: async () => {
      await ky.put(`roles/${id}/capabilities`, { json: { capabilityIds: roleCapabilitiesListIds } });
      await queryClient.invalidateQueries(namespace);
      // await queryClient.invalidateQueries([roleDataNamespace, id]);
    },
  });
  return { mutateRole: mutateAsync, isLoading };
};

export default useEditRoleMutation;


