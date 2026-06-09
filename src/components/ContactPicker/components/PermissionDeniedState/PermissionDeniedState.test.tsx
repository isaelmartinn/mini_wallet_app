import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { PermissionDeniedState } from './PermissionDeniedState';

describe('PermissionDeniedState', () => {
  const mockOnOpenSettings = jest.fn();
  const mockOnManualEntry = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with canAskAgain true', () => {
    const { getByText, queryByText } = render(
      <PermissionDeniedState
        canAskAgain={true}
        onOpenSettings={mockOnOpenSettings}
        onManualEntry={mockOnManualEntry}
      />,
    );

    expect(getByText('Permiso de contactos denegado')).toBeTruthy();
    expect(
      getByText(/Puedes continuar ingresando los datos manualmente/),
    ).toBeTruthy();
    expect(queryByText('Abrir Configuración')).toBeNull();
    expect(getByText('Ingresar manualmente')).toBeTruthy();
  });

  it('renders correctly with canAskAgain false', () => {
    const { getByText } = render(
      <PermissionDeniedState
        canAskAgain={false}
        onOpenSettings={mockOnOpenSettings}
        onManualEntry={mockOnManualEntry}
      />,
    );

    expect(getByText('Permiso de contactos denegado')).toBeTruthy();
    expect(
      getByText(
        /Puedes habilitar el permiso en la configuración de tu dispositivo/,
      ),
    ).toBeTruthy();
    expect(getByText('Abrir Configuración')).toBeTruthy();
    expect(getByText('Ingresar manualmente')).toBeTruthy();
  });

  it('calls onOpenSettings when "Abrir Configuración" button is pressed', () => {
    const { getByText } = render(
      <PermissionDeniedState
        canAskAgain={false}
        onOpenSettings={mockOnOpenSettings}
        onManualEntry={mockOnManualEntry}
      />,
    );

    const openSettingsButton = getByText('Abrir Configuración');
    fireEvent.press(openSettingsButton);

    expect(mockOnOpenSettings).toHaveBeenCalledTimes(1);
    expect(mockOnManualEntry).not.toHaveBeenCalled();
  });

  it('calls onManualEntry when "Ingresar manualmente" button is pressed', () => {
    const { getByText } = render(
      <PermissionDeniedState
        canAskAgain={true}
        onOpenSettings={mockOnOpenSettings}
        onManualEntry={mockOnManualEntry}
      />,
    );

    const manualEntryButton = getByText('Ingresar manualmente');
    fireEvent.press(manualEntryButton);

    expect(mockOnManualEntry).toHaveBeenCalledTimes(1);
    expect(mockOnOpenSettings).not.toHaveBeenCalled();
  });

  it('displays correct icon emoji', () => {
    const { getByText } = render(
      <PermissionDeniedState
        canAskAgain={true}
        onOpenSettings={mockOnOpenSettings}
        onManualEntry={mockOnManualEntry}
      />,
    );

    expect(getByText('📱')).toBeTruthy();
  });
});
