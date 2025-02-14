import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import { MemoryRouter } from 'react-router-dom';

import { render } from '@folio/jest-config-stripes/testing-library/react';

import AuthorizationRoles from './index';

jest.mock('@k-int/stripes-kint-components', () => ({
  useIntlKeyStore: jest.fn().mockReturnValue(jest.fn()),
}));

jest.mock('@folio/stripes-authorization-components', () => ({
  RoleCreate: () => <div>RoleCreate</div>,
  RoleEdit: () => <div>RoleEdit</div>,
}));

jest.mock('./settings', () => () => <div>Settings</div>);

const queryClient = new QueryClient();

const renderComponent = (initialPath) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialPath]}>
        <AuthorizationRoles match={{ path: '/settings' }} />
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe('AuthorizationRoles', () => {
  it('should display settings page', async () => {
    const { findByText } = renderComponent('/settings/authorization-roles');

    const listConfigurationTitle = await findByText('Settings');

    expect(listConfigurationTitle).toBeInTheDocument();
  });

  it('should display RoleCreate page', async () => {
    const { getByText } = renderComponent('/settings/create');

    expect(getByText('RoleCreate')).toBeInTheDocument();
  });

  it('should display RoleEdit page', async () => {
    const { getByText } = renderComponent('/settings/123/edit');

    expect(getByText('RoleEdit')).toBeInTheDocument();
  });
});
