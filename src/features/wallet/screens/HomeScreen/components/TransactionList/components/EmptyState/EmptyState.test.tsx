import React from 'react';
import { render } from '@testing-library/react-native';
import { EmptyState } from './EmptyState';

describe('EmptyState', () => {
  it('renders correctly', () => {
    const { getByText } = render(<EmptyState />);

    expect(getByText('💳')).toBeTruthy();
    expect(getByText('No hay transacciones')).toBeTruthy();
    expect(getByText('Tus movimientos aparecerán aquí')).toBeTruthy();
  });
});
