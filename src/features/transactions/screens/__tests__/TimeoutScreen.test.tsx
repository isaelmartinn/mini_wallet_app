import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {TimeoutScreen} from '../TimeoutScreen';
import {useTransactionFlowStore} from '@/store/transactionFlowStore';

jest.mock('@/store/transactionFlowStore');

const mockNavigation = {
  replace: jest.fn(),
} as unknown as StackNavigationProp<Record<string, object | undefined>>;

describe('TimeoutScreen', () => {
  const mockReset = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useTransactionFlowStore as unknown as jest.Mock).mockReturnValue({
      reset: mockReset,
    });
  });

  describe('Renderizado', () => {
    it('should render correctly', () => {
      const {getByText} = render(<TimeoutScreen navigation={mockNavigation} />);

      expect(getByText('Tiempo agotado')).toBeTruthy();
      expect(
        getByText('La sesión ha expirado por inactividad. Por favor, intenta nuevamente.')
      ).toBeTruthy();
      expect(getByText('Intentar de nuevo')).toBeTruthy();
      expect(getByText('Volver al inicio')).toBeTruthy();
    });
  });

  describe('Navegación - Botón "Intentar de nuevo"', () => {
    it('should navigate to AmountScreen when "Intentar de nuevo" is pressed', () => {
      const {getByText} = render(<TimeoutScreen navigation={mockNavigation} />);

      const tryAgainButton = getByText('Intentar de nuevo');
      fireEvent.press(tryAgainButton);

      expect(mockNavigation.replace).toHaveBeenCalledWith('Amount');
    });

    it('should reset transaction store when navigating to AmountScreen', () => {
      const {getByText} = render(<TimeoutScreen navigation={mockNavigation} />);

      const tryAgainButton = getByText('Intentar de nuevo');
      fireEvent.press(tryAgainButton);

      expect(mockReset).toHaveBeenCalled();
    });
  });

  describe('Navegación - Botón "Volver al inicio"', () => {
    it('should navigate to Home when "Volver al inicio" is pressed', () => {
      const {getByText} = render(<TimeoutScreen navigation={mockNavigation} />);

      const goHomeButton = getByText('Volver al inicio');
      fireEvent.press(goHomeButton);

      expect(mockNavigation.replace).toHaveBeenCalledWith('Home');
    });

    it('should reset transaction store when navigating to Home', () => {
      const {getByText} = render(<TimeoutScreen navigation={mockNavigation} />);

      const goHomeButton = getByText('Volver al inicio');
      fireEvent.press(goHomeButton);

      expect(mockReset).toHaveBeenCalled();
    });
  });
});
