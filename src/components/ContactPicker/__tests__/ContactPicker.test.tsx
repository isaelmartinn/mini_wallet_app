import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
import {ContactPicker} from '../ContactPicker';
import {useContacts} from '@/hooks/useContacts';
import {openDeviceSettings} from '@/utils/deviceSettings';
import {Contact} from '@/types/contacts';

jest.mock('@/hooks/useContacts');
jest.mock('@/utils/deviceSettings');

const mockUseContacts = useContacts as jest.MockedFunction<typeof useContacts>;
const mockOpenDeviceSettings = openDeviceSettings as jest.MockedFunction<
  typeof openDeviceSettings
>;

describe('ContactPicker', () => {
  const mockOnClose = jest.fn();
  const mockOnSelectContact = jest.fn();

  const defaultProps = {
    visible: true,
    onClose: mockOnClose,
    onSelectContact: mockOnSelectContact,
  };

  const mockContacts: Contact[] = [
    {id: '1', name: 'John Doe', phoneNumber: '1234567890'},
    {id: '2', name: 'Jane Smith', phoneNumber: '0987654321'},
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseContacts.mockReturnValue({
      contacts: [],
      isLoading: false,
      error: null,
      permissionGranted: false,
      canAskAgain: true,
      isAvailable: true,
      requestPermission: jest.fn(),
      fetchContacts: jest.fn(),
      reset: jest.fn(),
    });
  });

  it('should render modal when visible is true', () => {
    const {getByText} = render(<ContactPicker {...defaultProps} />);

    expect(getByText('Seleccionar contacto')).toBeTruthy();
  });

  it('should call onClose when close button is pressed', () => {
    const {getByText} = render(<ContactPicker {...defaultProps} />);

    const closeButton = getByText('Cerrar');
    fireEvent.press(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should show loading state', () => {
    mockUseContacts.mockReturnValue({
      contacts: [],
      isLoading: true,
      error: null,
      permissionGranted: false,
      canAskAgain: true,
      isAvailable: true,
      requestPermission: jest.fn(),
      fetchContacts: jest.fn(),
      reset: jest.fn(),
    });

    const {getByText} = render(<ContactPicker {...defaultProps} />);

    expect(getByText('Cargando contactos...')).toBeTruthy();
  });

  it('should show permission denied state when permission is denied', () => {
    mockUseContacts.mockReturnValue({
      contacts: [],
      isLoading: false,
      error: 'Permiso de contactos denegado',
      permissionGranted: false,
      canAskAgain: true,
      isAvailable: true,
      requestPermission: jest.fn(),
      fetchContacts: jest.fn(),
      reset: jest.fn(),
    });

    const {getByText} = render(<ContactPicker {...defaultProps} />);

    expect(getByText('Permiso de contactos denegado')).toBeTruthy();
    expect(getByText('Ingresar manualmente')).toBeTruthy();
  });

  it('should call onClose when "Ingresar manualmente" is pressed', () => {
    mockUseContacts.mockReturnValue({
      contacts: [],
      isLoading: false,
      error: 'Permiso de contactos denegado',
      permissionGranted: false,
      canAskAgain: true,
      isAvailable: true,
      requestPermission: jest.fn(),
      fetchContacts: jest.fn(),
      reset: jest.fn(),
    });

    const {getByText} = render(<ContactPicker {...defaultProps} />);

    const manualEntryButton = getByText('Ingresar manualmente');
    fireEvent.press(manualEntryButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should show "Abrir Configuración" button when canAskAgain is false', () => {
    mockUseContacts.mockReturnValue({
      contacts: [],
      isLoading: false,
      error: 'Permiso de contactos denegado',
      permissionGranted: false,
      canAskAgain: false,
      isAvailable: true,
      requestPermission: jest.fn(),
      fetchContacts: jest.fn(),
      reset: jest.fn(),
    });

    const {getByText} = render(<ContactPicker {...defaultProps} />);

    expect(getByText('Abrir Configuración')).toBeTruthy();
  });

  it('should open device settings when "Abrir Configuración" is pressed', async () => {
    mockUseContacts.mockReturnValue({
      contacts: [],
      isLoading: false,
      error: 'Permiso de contactos denegado',
      permissionGranted: false,
      canAskAgain: false,
      isAvailable: true,
      requestPermission: jest.fn(),
      fetchContacts: jest.fn(),
      reset: jest.fn(),
    });

    mockOpenDeviceSettings.mockResolvedValue(true);

    const {getByText} = render(<ContactPicker {...defaultProps} />);

    const settingsButton = getByText('Abrir Configuración');
    fireEvent.press(settingsButton);

    await waitFor(() => {
      expect(mockOpenDeviceSettings).toHaveBeenCalledTimes(1);
    });
  });

  it('should not show "Abrir Configuración" button when canAskAgain is true', () => {
    mockUseContacts.mockReturnValue({
      contacts: [],
      isLoading: false,
      error: 'Permiso de contactos denegado',
      permissionGranted: false,
      canAskAgain: true,
      isAvailable: true,
      requestPermission: jest.fn(),
      fetchContacts: jest.fn(),
      reset: jest.fn(),
    });

    const {queryByText} = render(<ContactPicker {...defaultProps} />);

    expect(queryByText('Abrir Configuración')).toBeNull();
  });

  it('should always allow closing the modal via close button', () => {
    mockUseContacts.mockReturnValue({
      contacts: [],
      isLoading: false,
      error: 'Permiso de contactos denegado',
      permissionGranted: false,
      canAskAgain: false,
      isAvailable: true,
      requestPermission: jest.fn(),
      fetchContacts: jest.fn(),
      reset: jest.fn(),
    });

    const {getByText} = render(<ContactPicker {...defaultProps} />);

    const closeButton = getByText('Cerrar');
    fireEvent.press(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should render contacts list when contacts are available', () => {
    mockUseContacts.mockReturnValue({
      contacts: mockContacts,
      isLoading: false,
      error: null,
      permissionGranted: true,
      canAskAgain: true,
      isAvailable: true,
      requestPermission: jest.fn(),
      fetchContacts: jest.fn(),
      reset: jest.fn(),
    });

    const {getByText} = render(<ContactPicker {...defaultProps} />);

    expect(getByText('John Doe')).toBeTruthy();
    expect(getByText('Jane Smith')).toBeTruthy();
  });

  it('should call onSelectContact when a contact is pressed', () => {
    mockUseContacts.mockReturnValue({
      contacts: mockContacts,
      isLoading: false,
      error: null,
      permissionGranted: true,
      canAskAgain: true,
      isAvailable: true,
      requestPermission: jest.fn(),
      fetchContacts: jest.fn(),
      reset: jest.fn(),
    });

    const {getByText} = render(<ContactPicker {...defaultProps} />);

    const contactItem = getByText('John Doe');
    fireEvent.press(contactItem);

    expect(mockOnSelectContact).toHaveBeenCalledWith(mockContacts[0]);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should show empty state when no contacts are found after search', () => {
    mockUseContacts.mockReturnValue({
      contacts: mockContacts,
      isLoading: false,
      error: null,
      permissionGranted: true,
      canAskAgain: true,
      isAvailable: true,
      requestPermission: jest.fn(),
      fetchContacts: jest.fn(),
      reset: jest.fn(),
    });

    const {getByPlaceholderText, getByText} = render(
      <ContactPicker {...defaultProps} />,
    );

    const searchInput = getByPlaceholderText('Buscar por nombre o teléfono');
    fireEvent.changeText(searchInput, 'NonExistentContact');

    expect(getByText('No se encontraron contactos')).toBeTruthy();
  });

  it('should return null when module is not available', () => {
    mockUseContacts.mockReturnValue({
      contacts: [],
      isLoading: false,
      error: null,
      permissionGranted: false,
      canAskAgain: true,
      isAvailable: false,
      requestPermission: jest.fn(),
      fetchContacts: jest.fn(),
      reset: jest.fn(),
    });

    const {queryByText} = render(<ContactPicker {...defaultProps} />);

    expect(queryByText('Seleccionar contacto')).toBeNull();
  });
});
