import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ActivityIndicator } from 'react-native';
import { LoginScreen } from './LoginScreen';
import { useLogin } from '../../hooks/useLogin';

jest.mock('../../hooks/useLogin');

describe('LoginScreen', () => {
  const mockHandleIdentifierChange = jest.fn();
  const mockHandleLogin = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useLogin as jest.Mock).mockReturnValue({
      identifier: '',
      handleIdentifierChange: mockHandleIdentifierChange,
      handleLogin: mockHandleLogin,
      isLoading: false,
      error: null,
    });
  });

  it('debe renderizar correctamente', () => {
    const { getByText, getByPlaceholderText } = render(<LoginScreen />);

    expect(getByText('Bienvenido')).toBeTruthy();
    expect(
      getByText('Ingresa tu email o teléfono para continuar'),
    ).toBeTruthy();
    expect(getByText('Email o Teléfono')).toBeTruthy();
    expect(
      getByPlaceholderText('ejemplo@email.com o +523314530322'),
    ).toBeTruthy();
    expect(getByText('Iniciar Sesión')).toBeTruthy();
  });

  it('debe llamar handleIdentifierChange cuando el usuario escribe', () => {
    const { getByPlaceholderText } = render(<LoginScreen />);

    const input = getByPlaceholderText('ejemplo@email.com o +523314530322');
    fireEvent.changeText(input, 'test@example.com');

    expect(mockHandleIdentifierChange).toHaveBeenCalledWith('test@example.com');
  });

  it('debe llamar handleLogin cuando se presiona el botón', () => {
    const { getByText } = render(<LoginScreen />);

    const button = getByText('Iniciar Sesión');
    fireEvent.press(button);

    expect(mockHandleLogin).toHaveBeenCalled();
  });

  it('debe mostrar el error cuando existe', () => {
    (useLogin as jest.Mock).mockReturnValue({
      identifier: 'invalid',
      handleIdentifierChange: mockHandleIdentifierChange,
      handleLogin: mockHandleLogin,
      isLoading: false,
      error: 'Identificador inválido',
    });

    const { getByText } = render(<LoginScreen />);

    expect(getByText('Identificador inválido')).toBeTruthy();
  });

  it('debe deshabilitar el input cuando está cargando', () => {
    (useLogin as jest.Mock).mockReturnValue({
      identifier: 'test@example.com',
      handleIdentifierChange: mockHandleIdentifierChange,
      handleLogin: mockHandleLogin,
      isLoading: true,
      error: null,
    });

    const { getByPlaceholderText } = render(<LoginScreen />);

    const input = getByPlaceholderText('ejemplo@email.com o +523314530322');
    expect(input.props.editable).toBe(false);
  });

  it('debe mostrar loading en el botón cuando está cargando', () => {
    (useLogin as jest.Mock).mockReturnValue({
      identifier: 'test@example.com',
      handleIdentifierChange: mockHandleIdentifierChange,
      handleLogin: mockHandleLogin,
      isLoading: true,
      error: null,
    });

    const { UNSAFE_getByType } = render(<LoginScreen />);

    const loader = UNSAFE_getByType(ActivityIndicator);
    expect(loader).toBeTruthy();
  });

  it('debe mostrar el valor del identifier en el input', () => {
    (useLogin as jest.Mock).mockReturnValue({
      identifier: 'test@example.com',
      handleIdentifierChange: mockHandleIdentifierChange,
      handleLogin: mockHandleLogin,
      isLoading: false,
      error: null,
    });

    const { getByPlaceholderText } = render(<LoginScreen />);

    const input = getByPlaceholderText('ejemplo@email.com o +523314530322');
    expect(input.props.value).toBe('test@example.com');
  });

  it('debe tener el teclado configurado correctamente', () => {
    const { getByPlaceholderText } = render(<LoginScreen />);

    const input = getByPlaceholderText('ejemplo@email.com o +523314530322');
    expect(input.props.keyboardType).toBe('email-address');
    expect(input.props.autoCapitalize).toBe('none');
    expect(input.props.autoCorrect).toBe(false);
  });
});
