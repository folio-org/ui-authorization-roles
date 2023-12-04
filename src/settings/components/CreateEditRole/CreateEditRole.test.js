import React from 'react';

import userEvent from '@testing-library/user-event';
import { cleanup } from '@testing-library/react';
import { renderWithIntl } from '@folio/stripes-erm-testing';
import { MemoryRouter } from 'react-router';

import translationsProperties from '../../../../test/helpers/translationsProperties';

import '@testing-library/jest-dom';

import CreateEditRole from './CreateEditRole';

function mockFunction() {
  const original = jest.requireActual('react-router-dom');
  return {
    ...original,
    useLocation: jest.fn().mockReturnValue({
      pathname: '/another-route',
      search: '',
      hash: '',
      state: null,
      key: '5nvxpbdafa',
    }),
  };
}

jest.mock('react-router-dom', () => mockFunction());

jest.mock('@folio/stripes/components', () => {
  const original = jest.requireActual('@folio/stripes/components');
  return {
    ...original,
    Layer: jest.fn(({ children }) => <div data-testid="mock-layer">{children}</div>)
  };
});

describe('SearchForm component', () => {
  afterEach(() => {
    cleanup();
  });


  it('renders SearchField and Button components', async () => {
    const { getByTestId } = renderWithIntl(
      <MemoryRouter>
        <CreateEditRole refetch={jest.fn()} />
      </MemoryRouter>,
      translationsProperties
    );

    expect(getByTestId('create-role-form')).toBeInTheDocument();
  });

  it('changes name, description input values', async () => {
    const { getByTestId } = renderWithIntl(
      <MemoryRouter>
        <CreateEditRole refetch={jest.fn()} />
      </MemoryRouter>,
      translationsProperties
    );

    const nameInput = getByTestId('rolename-input');
    const descriptionInput = getByTestId('description-input');

    await userEvent.type(nameInput, 'New Role');
    await userEvent.type(descriptionInput, 'Description');

    expect(nameInput).toHaveValue('New Role');
    expect(descriptionInput).toHaveValue('Description');
  });

  it('actions on click footer buttons', async () => {
    const { getByTestId, getByRole } = renderWithIntl(
      <MemoryRouter>
        <CreateEditRole refetch={jest.fn()} />
      </MemoryRouter>,
      translationsProperties
    );

    const submitButton = getByRole('button', { name: 'Save and close' });
    const cancelButton = getByRole('button', { name: 'Cancel' });

    expect(submitButton).toBeDisabled();
    expect(cancelButton).toBeInTheDocument();

    await userEvent.type(getByTestId('rolename-input'), 'New Role');

    expect(submitButton).toBeEnabled();
  });
});
