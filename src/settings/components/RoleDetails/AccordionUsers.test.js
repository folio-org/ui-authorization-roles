import { cleanup } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import '@testing-library/jest-dom';

import { render } from '@folio/jest-config-stripes/testing-library/react';

import AccordionUsers from './AccordionUsers';
import useUsersByRoleId from '../../../hooks/useUsersByRoleId';
import useUsergroups from '../../../hooks/useUsergroups';
import renderWithRouter from '../../../../test/jest/helpers/renderWithRouter';

jest.mock('../../../hooks/useUsersByRoleId');
jest.mock('../../../hooks/useUsergroups');
jest.mock('./AssignUsers');

const queryClient = new QueryClient();

const users = [
  {
    'username': 'aapple',
    'id': 'a1',
    'active': true,
    'type': 'staff',
    'patronGroup': 'pg1',
    'personal': {
      'lastName': 'Andrea',
      'firstName': 'Apple',
      'middleName': 'A'
    },
  },
  {
    'username': 'bblick',
    'id': 'b2',
    'active': true,
    'type': 'staff',
    'patronGroup': 'pg2',
    'personal': {
      'lastName': 'Bethany',
      'firstName': 'Blick',
      'middleName': 'B'
    }
  }
];

const usergroups = [
  { id: 'pg1', desc: 'The Flaming lips', group: 'lips' },
  { id: 'pg2', desc: 'Belle and Sebastian', group: 'belle' },
];

const renderComponent = () => render(
  renderWithRouter(
    <QueryClientProvider client={queryClient}>
      <AccordionUsers roleId="1" />
    </QueryClientProvider>
  )
);

describe('AccordionUsers component', () => {
  afterEach(() => {
    cleanup();
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  describe('displays accordion', () => {
    useUsersByRoleId.mockReturnValue({ users, isLoading: false });
    useUsergroups.mockReturnValue({ usergroups, isLoading: false });
    const { getByText } = renderComponent();

    it('render expanded role info by default', () => {
      getByText('ui-authorization-roles.assignedUsers');
      getByText(users[0].personal.firstName, { exact: false });
      getByText(users[1].personal.firstName, { exact: false });
      getByText(usergroups[0].desc, { exact: false });
      getByText(usergroups[1].desc, { exact: false });
    });
  });

  it('render loading spinner', () => {
    useUsersByRoleId.mockReturnValue({ isLoading: true });

    const { getByText } = renderComponent();

    getByText('Loading');
  });
});
