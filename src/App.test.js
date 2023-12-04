import { render } from '@testing-library/react';
import { useIntlKeyStore } from '@k-int/stripes-kint-components';

import App from '.';

jest.mock('@k-int/stripes-kint-components', () => ({
  useIntlKeyStore: jest.fn().mockReturnValue(jest.fn()),
}));

jest.mock('./settings', () => ({
  __esModule: true,
  default: jest
    .fn()
    .mockImplementation(() => (
      <div data-testid="mocked-settings-page">Settings Page</div>
    )),
}));

describe('App component', () => {
  it('calls the addKey of useIntlKeyStore function with the correct namespace', () => {
    render(<App />);
    expect(useIntlKeyStore()).toHaveBeenCalledWith('ui-authorization-roles');
  });
});
