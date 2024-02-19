import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

import { render } from '@folio/jest-config-stripes/testing-library/react';

import AccordionUsers from './AccordionUsers';
import useUsersByRoleId from '../../../hooks/useUsersByRoleId';
import renderWithRouter from '../../../../test/jest/helpers/renderWithRouter';

jest.mock('../../../hooks/useUsersByRoleId');

const users = [
  {
    'username': 'aapple',
    'id': 'a1',
    'active': true,
    'type': 'staff',
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
    'personal': {
      'lastName': 'Bethany',
      'firstName': 'Blick',
      'middleName': 'B'
    }
  }
];

const renderComponent = () => render(
  renderWithRouter(
    <AccordionUsers roleId="1" />
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
    const { getByText } = renderComponent();

    it('render expanded role info by default', () => {
      getByText('ui-authorization-roles.assignedUsers');
      getByText(users[0].personal.firstName, { exact: false });
      getByText(users[1].personal.firstName, { exact: false });
    });
  });

  it('render loading spinner', () => {
    useUsersByRoleId.mockReturnValue({ isLoading: true });

    const { getByText } = renderComponent();

    getByText('Loading');
  });
});
