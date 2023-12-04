import React from 'react';

import userEvent from '@testing-library/user-event';
import { cleanup } from '@testing-library/react';
import { renderWithIntl } from '@folio/stripes-erm-testing';

import translationsProperties from '../../../../test/helpers/translationsProperties';

import '@testing-library/jest-dom';
import SearchForm from './SearchForm';

const setSearchTerm = jest.fn();
const onSubmit = jest.fn();

describe('SearchForm component', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders SearchField and Button components', () => {
    const { getByTestId } = renderWithIntl(
      <SearchForm searchTerm="" setSearchTerm={setSearchTerm} onSubmit={onSubmit} />,
      translationsProperties
    );
    expect(getByTestId('search-field')).toBeInTheDocument();
    expect(getByTestId('search-button')).toBeInTheDocument();
  });

  it('calls setSearchTerm when the search field content changes', async () => {
    const { getByTestId } = renderWithIntl(
      <SearchForm
        searchTerm=""
        setSearchTerm={setSearchTerm}
        onSubmit={onSubmit}
      />,
      translationsProperties
    );

    await userEvent.type(getByTestId('search-field'), 'New test search term');

    expect(setSearchTerm).toHaveBeenCalledWith('New test search term');
  });

  it('calls onSubmit handler', async () => {
    const { getByTestId } = renderWithIntl(
      <SearchForm
        searchTerm=""
        setSearchTerm={setSearchTerm}
        onSubmit={onSubmit}
      />,
      translationsProperties
    );

    userEvent.type(getByTestId('search-field'),
      'New test search term');

    await userEvent.click(getByTestId('search-button'));

    expect(onSubmit).toHaveBeenCalled();
  });
});
