import React from 'react';
import { render } from '@folio/jest-config-stripes/testing-library/react';
import { CheckboxWithAsterisk } from './CheckboxWithAsterisk';

describe('CheckboxWithAsterisk', () => {
  it('renders without crashing', () => {
    render(<CheckboxWithAsterisk />);
  });

  test('renders CheckboxWithAsterisk correctly without count', () => {
    const { container } = render(<CheckboxWithAsterisk />);
    const checkboxContainerClassName = container.firstChild.getAttribute('class');
    const checkboxClassName = container.firstChild.firstChild.getAttribute('class');
    expect(checkboxContainerClassName).toMatch(/checkbox-wrapper/);
    expect(checkboxClassName).toMatch(/checkbox/);
  });

  test('renders CheckboxWithAsterisk correctly with count > 1', () => {
    const { container } = render(<CheckboxWithAsterisk count={2} />);
    const checkboxClassName = container.firstChild.firstChild.getAttribute('class');
    expect(checkboxClassName).toMatch(/checkbox-with-asterisk/);
  });
});
