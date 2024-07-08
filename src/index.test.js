import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import { MemoryRouter } from 'react-router-dom';

import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

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

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    <MemoryRouter
      initialEntries={[{
        pathname: '/settings',
      }]}
    >
      {children}
    </MemoryRouter>
  </QueryClientProvider>
);

const renderComponent = () => render(
  <AuthorizationRoles match={{ path: '/settings' }} />,
  { wrapper },
);

describe('AuthorizationRoles', () => {
  it('should display authorization roles page', async () => {
    window.location.pathname = '/settings/authorization-roles';
    renderComponent();

    const listConfigurationTitle = await screen.findByText('Settings');

    expect(listConfigurationTitle).toBeInTheDocument();
  });

  it('should display email preview content', async () => {
    window.location.pathname = '/settings/create';
    renderComponent();

    expect(screen.getByText('RoleCreate')).toBeInTheDocument();
  });

  it('should display email preview content', async () => {
    window.location.pathname = '/settings/authorization-roles/edit';
    renderComponent();

    expect(screen.getByText('RoleEdit')).toBeInTheDocument();
  });
});
