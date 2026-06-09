import React from 'react';
import { render } from '@testing-library/react-native';
import { NoResultsState } from './NoResultsState';

describe('NoResultsState', () => {
  it('renders correctly', () => {
    const { getByText } = render(<NoResultsState />);

    expect(getByText('No se encontraron contactos')).toBeTruthy();
  });
});
