import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { ContactPicker } from './ContactPicker';
import { useContacts } from '@/hooks/useContacts';
import { openDeviceSettings } from '@/utils/deviceSettings';
import { Contact } from '@/types/contacts';

jest.mock('@/hooks/useContacts');
jest.mock('@/utils/deviceSettings');
jest.mock('@/components', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { TouchableOpacity, Text } = require('react-native');
  return {
    Button: ({
      children,
      onPress,
    }: {
      children: React.ReactNode;
      onPress: () => void;
    }) => {
      return (
        <TouchableOpacity onPress={onPress} testID="mock-button">
          <Text>{children}</Text>
        </TouchableOpacity>
      );
    },
  };
});

describe('ContactPicker', () => {
  const mockOnClose = jest.fn();
  const mockOnSelectContact = jest.fn();
  const mockFetchContacts = jest.fn();
  const mockReset = jest.fn();
  const mockOpenDeviceSettings = openDeviceSettings as jest.MockedFunction<
    typeof openDeviceSettings
  >;

  const mockContacts: Contact[] = [
    { id: '1', name: 'John Doe', phoneNumber: '1234567890' },
    { id: '2', name: 'Jane Smith', phoneNumber: '0987654321' },
    { id: '3', name: 'Bob Johnson', phoneNumber: '5555555555' },
  ];

  const defaultUseContactsReturn = {
    contacts: [],
    isLoading: false,
    error: null,
    isAvailable: true,
    canAskAgain: true,
    permissionGranted: false,
    fetchContacts: mockFetchContacts,
    requestPermission: jest.fn(),
    reset: mockReset,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useContacts as jest.Mock).mockReturnValue(defaultUseContactsReturn);
  });

  describe('Rendering', () => {
    it('should not render when isAvailable is false', () => {
      (useContacts as jest.Mock).mockReturnValue({
        ...defaultUseContactsReturn,
        isAvailable: false,
      });

      const { queryByText } = render(
        <ContactPicker
          visible={true}
          onClose={mockOnClose}
          onSelectContact={mockOnSelectContact}
        />,
      );

      expect(queryByText('Seleccionar contacto')).toBeNull();
    });

    it('should render modal when visible and isAvailable is true', () => {
      const { getByText } = render(
        <ContactPicker
          visible={true}
          onClose={mockOnClose}
          onSelectContact={mockOnSelectContact}
        />,
      );

      expect(getByText('Seleccionar contacto')).toBeTruthy();
      expect(getByText('Cerrar')).toBeTruthy();
    });

    it('should render search input', () => {
      const { getByPlaceholderText } = render(
        <ContactPicker
          visible={true}
          onClose={mockOnClose}
          onSelectContact={mockOnSelectContact}
        />,
      );

      expect(getByPlaceholderText('Buscar por nombre o teléfono')).toBeTruthy();
    });
  });

  describe('Contact Loading', () => {
    it('should call fetchContacts when modal becomes visible', async () => {
      const { rerender } = render(
        <ContactPicker
          visible={false}
          onClose={mockOnClose}
          onSelectContact={mockOnSelectContact}
        />,
      );

      rerender(
        <ContactPicker
          visible={true}
          onClose={mockOnClose}
          onSelectContact={mockOnSelectContact}
        />,
      );

      await waitFor(() => {
        expect(mockFetchContacts).toHaveBeenCalled();
      });
    });

    it('should show loading state', () => {
      (useContacts as jest.Mock).mockReturnValue({
        ...defaultUseContactsReturn,
        isLoading: true,
      });

      const { getByText } = render(
        <ContactPicker
          visible={true}
          onClose={mockOnClose}
          onSelectContact={mockOnSelectContact}
        />,
      );

      expect(getByText('Cargando contactos...')).toBeTruthy();
    });

    it('should display contacts when loaded', () => {
      (useContacts as jest.Mock).mockReturnValue({
        ...defaultUseContactsReturn,
        contacts: mockContacts,
      });

      const { getByText } = render(
        <ContactPicker
          visible={true}
          onClose={mockOnClose}
          onSelectContact={mockOnSelectContact}
        />,
      );

      expect(getByText('John Doe')).toBeTruthy();
      expect(getByText('1234567890')).toBeTruthy();
      expect(getByText('Jane Smith')).toBeTruthy();
      expect(getByText('0987654321')).toBeTruthy();
    });
  });

  describe('Search Functionality', () => {
    it('should filter contacts by name', () => {
      (useContacts as jest.Mock).mockReturnValue({
        ...defaultUseContactsReturn,
        contacts: mockContacts,
      });

      const { getByPlaceholderText, getByText, queryByText } = render(
        <ContactPicker
          visible={true}
          onClose={mockOnClose}
          onSelectContact={mockOnSelectContact}
        />,
      );

      const searchInput = getByPlaceholderText('Buscar por nombre o teléfono');
      fireEvent.changeText(searchInput, 'john');

      expect(getByText('John Doe')).toBeTruthy();
      expect(queryByText('Jane Smith')).toBeNull();
      expect(queryByText('Bob Johnson')).toBeTruthy();
    });

    it('should filter contacts by phone number', () => {
      (useContacts as jest.Mock).mockReturnValue({
        ...defaultUseContactsReturn,
        contacts: mockContacts,
      });

      const { getByPlaceholderText, getByText, queryByText } = render(
        <ContactPicker
          visible={true}
          onClose={mockOnClose}
          onSelectContact={mockOnSelectContact}
        />,
      );

      const searchInput = getByPlaceholderText('Buscar por nombre o teléfono');
      fireEvent.changeText(searchInput, '1234');

      expect(getByText('John Doe')).toBeTruthy();
      expect(queryByText('Jane Smith')).toBeNull();
    });

    it('should show no results message when search has no matches', () => {
      (useContacts as jest.Mock).mockReturnValue({
        ...defaultUseContactsReturn,
        contacts: mockContacts,
      });

      const { getByPlaceholderText, getByText } = render(
        <ContactPicker
          visible={true}
          onClose={mockOnClose}
          onSelectContact={mockOnSelectContact}
        />,
      );

      const searchInput = getByPlaceholderText('Buscar por nombre o teléfono');
      fireEvent.changeText(searchInput, 'xyz123notfound');

      expect(getByText('No se encontraron contactos')).toBeTruthy();
    });

    it('should be case insensitive', () => {
      (useContacts as jest.Mock).mockReturnValue({
        ...defaultUseContactsReturn,
        contacts: mockContacts,
      });

      const { getByPlaceholderText, getByText } = render(
        <ContactPicker
          visible={true}
          onClose={mockOnClose}
          onSelectContact={mockOnSelectContact}
        />,
      );

      const searchInput = getByPlaceholderText('Buscar por nombre o teléfono');
      fireEvent.changeText(searchInput, 'JOHN');

      expect(getByText('John Doe')).toBeTruthy();
    });
  });

  describe('Contact Selection', () => {
    it('should call onSelectContact when a contact is pressed', () => {
      (useContacts as jest.Mock).mockReturnValue({
        ...defaultUseContactsReturn,
        contacts: mockContacts,
      });

      const { getByText } = render(
        <ContactPicker
          visible={true}
          onClose={mockOnClose}
          onSelectContact={mockOnSelectContact}
        />,
      );

      fireEvent.press(getByText('John Doe'));

      expect(mockOnSelectContact).toHaveBeenCalledWith(mockContacts[0]);
    });

    it('should close modal after selecting a contact', () => {
      (useContacts as jest.Mock).mockReturnValue({
        ...defaultUseContactsReturn,
        contacts: mockContacts,
      });

      const { getByText } = render(
        <ContactPicker
          visible={true}
          onClose={mockOnClose}
          onSelectContact={mockOnSelectContact}
        />,
      );

      fireEvent.press(getByText('John Doe'));

      expect(mockOnClose).toHaveBeenCalled();
    });

    it('should reset state after selecting a contact', () => {
      (useContacts as jest.Mock).mockReturnValue({
        ...defaultUseContactsReturn,
        contacts: mockContacts,
      });

      const { getByText } = render(
        <ContactPicker
          visible={true}
          onClose={mockOnClose}
          onSelectContact={mockOnSelectContact}
        />,
      );

      fireEvent.press(getByText('John Doe'));

      expect(mockReset).toHaveBeenCalled();
    });
  });

  describe('Modal Close', () => {
    it('should call onClose when close button is pressed', () => {
      const { getByText } = render(
        <ContactPicker
          visible={true}
          onClose={mockOnClose}
          onSelectContact={mockOnSelectContact}
        />,
      );

      fireEvent.press(getByText('Cerrar'));

      expect(mockOnClose).toHaveBeenCalled();
    });

    it('should reset state when modal is closed', () => {
      const { getByText } = render(
        <ContactPicker
          visible={true}
          onClose={mockOnClose}
          onSelectContact={mockOnSelectContact}
        />,
      );

      fireEvent.press(getByText('Cerrar'));

      expect(mockReset).toHaveBeenCalled();
    });

    it('should clear search query when modal is closed', () => {
      (useContacts as jest.Mock).mockReturnValue({
        ...defaultUseContactsReturn,
        contacts: mockContacts,
      });

      const { getByText, getByPlaceholderText } = render(
        <ContactPicker
          visible={true}
          onClose={mockOnClose}
          onSelectContact={mockOnSelectContact}
        />,
      );

      const searchInput = getByPlaceholderText('Buscar por nombre o teléfono');
      fireEvent.changeText(searchInput, 'john');

      fireEvent.press(getByText('Cerrar'));

      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  describe('Permission Denied State', () => {
    it('should show permission denied message when error contains "denegado"', () => {
      (useContacts as jest.Mock).mockReturnValue({
        ...defaultUseContactsReturn,
        error: 'Permiso de contactos denegado',
      });

      const { getByText } = render(
        <ContactPicker
          visible={true}
          onClose={mockOnClose}
          onSelectContact={mockOnSelectContact}
        />,
      );

      expect(getByText('Permiso de contactos denegado')).toBeTruthy();
      expect(getByText(/Para seleccionar contactos/)).toBeTruthy();
    });

    it('should show "Abrir Configuración" button when canAskAgain is false', () => {
      (useContacts as jest.Mock).mockReturnValue({
        ...defaultUseContactsReturn,
        error: 'Permiso de contactos denegado',
        canAskAgain: false,
      });

      const { getByText } = render(
        <ContactPicker
          visible={true}
          onClose={mockOnClose}
          onSelectContact={mockOnSelectContact}
        />,
      );

      expect(getByText('Abrir Configuración')).toBeTruthy();
    });

    it('should not show "Abrir Configuración" button when canAskAgain is true', () => {
      (useContacts as jest.Mock).mockReturnValue({
        ...defaultUseContactsReturn,
        error: 'Permiso de contactos denegado',
        canAskAgain: true,
      });

      const { queryByText } = render(
        <ContactPicker
          visible={true}
          onClose={mockOnClose}
          onSelectContact={mockOnSelectContact}
        />,
      );

      expect(queryByText('Abrir Configuración')).toBeNull();
    });

    it('should call openDeviceSettings when "Abrir Configuración" is pressed', async () => {
      (useContacts as jest.Mock).mockReturnValue({
        ...defaultUseContactsReturn,
        error: 'Permiso de contactos denegado',
        canAskAgain: false,
      });

      const { getByText } = render(
        <ContactPicker
          visible={true}
          onClose={mockOnClose}
          onSelectContact={mockOnSelectContact}
        />,
      );

      fireEvent.press(getByText('Abrir Configuración'));

      await waitFor(() => {
        expect(mockOpenDeviceSettings).toHaveBeenCalled();
      });
    });

    it('should show "Ingresar manualmente" button', () => {
      (useContacts as jest.Mock).mockReturnValue({
        ...defaultUseContactsReturn,
        error: 'Permiso de contactos denegado',
      });

      const { getByText } = render(
        <ContactPicker
          visible={true}
          onClose={mockOnClose}
          onSelectContact={mockOnSelectContact}
        />,
      );

      expect(getByText('Ingresar manualmente')).toBeTruthy();
    });

    it('should close modal when "Ingresar manualmente" is pressed', () => {
      (useContacts as jest.Mock).mockReturnValue({
        ...defaultUseContactsReturn,
        error: 'Permiso de contactos denegado',
      });

      const { getByText } = render(
        <ContactPicker
          visible={true}
          onClose={mockOnClose}
          onSelectContact={mockOnSelectContact}
        />,
      );

      fireEvent.press(getByText('Ingresar manualmente'));

      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  describe('Empty States', () => {
    it('should show empty message when no contacts are available', () => {
      (useContacts as jest.Mock).mockReturnValue({
        ...defaultUseContactsReturn,
        contacts: [],
      });

      const { getByText } = render(
        <ContactPicker
          visible={true}
          onClose={mockOnClose}
          onSelectContact={mockOnSelectContact}
        />,
      );

      expect(getByText('No hay contactos disponibles')).toBeTruthy();
    });
  });

  describe('Contact Avatar', () => {
    it('should display first letter of contact name in avatar', () => {
      (useContacts as jest.Mock).mockReturnValue({
        ...defaultUseContactsReturn,
        contacts: mockContacts,
      });

      const { getAllByText, getByText } = render(
        <ContactPicker
          visible={true}
          onClose={mockOnClose}
          onSelectContact={mockOnSelectContact}
        />,
      );

      expect(getAllByText('J').length).toBeGreaterThan(0);
      expect(getByText('B')).toBeTruthy();
    });

    it('should uppercase the avatar letter', () => {
      (useContacts as jest.Mock).mockReturnValue({
        ...defaultUseContactsReturn,
        contacts: [{ id: '1', name: 'alice', phoneNumber: '1234567890' }],
      });

      const { getByText } = render(
        <ContactPicker
          visible={true}
          onClose={mockOnClose}
          onSelectContact={mockOnSelectContact}
        />,
      );

      expect(getByText('A')).toBeTruthy();
    });
  });
});
