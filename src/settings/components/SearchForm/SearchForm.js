import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { Button, SearchField } from '@folio/stripes/components';

import PropTypes from 'prop-types';
import css from '../../style.css';

const propTypes = {
  searchTerm: PropTypes.string.isRequired,
  setSearchTerm: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

const SearchForm = ({ searchTerm, setSearchTerm, onSubmit }) => {
  const intl = useIntl();

  return (
    <form
      className={css.lookupSearchContainer}
      onSubmit={onSubmit}
    >
      <SearchField
        autoFocus
        data-testid="search-field"
        ariaLabel={intl.formatMessage({ id: 'ui-authorization-roles.search' })}
        className={css.lookupSearch}
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
        onClear={() => setSearchTerm('')}
      />
      <Button
        data-testid="search-button"
        type="submit"
      >
        <FormattedMessage id="ui-authorization-roles.search" />
      </Button>
    </form>
  );
};

SearchForm.propTypes = propTypes;

export default SearchForm;
