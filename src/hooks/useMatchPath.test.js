import React from 'react';
import { renderHook } from '@folio/jest-config-stripes/testing-library/react';
import { MemoryRouter, useLocation } from 'react-router';
import useMatchPath from './useMatchPath';

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useLocation: jest.fn(),
}));

describe('useMatchPath', () => {
  afterAll(() => {
    jest.clearAllMocks();
  });
  it('should return the correct params from the matched path', () => {
    useLocation.mockReturnValue({ pathname: '/roles/123' });

    const wrapper = ({ children }) => (
      <MemoryRouter initialEntries={['/roles/123']}>
        {children}
      </MemoryRouter>
    );

    const { result } = renderHook(() => useMatchPath(), { wrapper });
    const pathPattern = '/roles/:id';
    const params = result.current.getParams(pathPattern);

    expect(params).toEqual({ id: '123' });
  });

  it('should return empty params when the path does not match', () => {
    useLocation.mockReturnValue({ pathname: '/roles/123' });

    const wrapper = ({ children }) => (
      <MemoryRouter initialEntries={['/roles/123']}>
        {children}
      </MemoryRouter>
    );

    const { result } = renderHook(() => useMatchPath(), { wrapper });
    const nonMatchingPathPattern = '/non-match-path/:id';
    const params = result.current.getParams(nonMatchingPathPattern);

    expect(params).toEqual({});
  });
});
