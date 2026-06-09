import React from 'react';
import { render } from '@testing-library/react-native';
import { LoadingState } from './LoadingState';

describe('LoadingState', () => {
  it('renders correctly', () => {
    const { getByText } = render(<LoadingState />);

    expect(getByText('Cargando contactos...')).toBeTruthy();
  });
});
