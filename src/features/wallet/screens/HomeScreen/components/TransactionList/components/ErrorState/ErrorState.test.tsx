import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ErrorState } from './ErrorState';

describe('ErrorState', () => {
  const mockOnRetry = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByText } = render(<ErrorState onRetry={mockOnRetry} />);

    expect(getByText('⚠️')).toBeTruthy();
    expect(getByText('Error al cargar transacciones')).toBeTruthy();
    expect(getByText('No pudimos cargar tus movimientos')).toBeTruthy();
    expect(getByText('Reintentar')).toBeTruthy();
  });

  it('calls onRetry when retry button is pressed', () => {
    const { getByText } = render(<ErrorState onRetry={mockOnRetry} />);

    fireEvent.press(getByText('Reintentar'));
    expect(mockOnRetry).toHaveBeenCalledTimes(1);
  });
});
