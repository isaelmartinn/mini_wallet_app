import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useContacts } from './useContacts';
import { contactsService } from '@/services/ContactsService';
import { Contact } from '@/types/contacts';

jest.mock('@/services/ContactsService', () => ({
  contactsService: {
    isAvailable: jest.fn(),
    requestPermission: jest.fn(),
    getContacts: jest.fn(),
  },
}));

describe('useContacts', () => {
  const mockContactsService = contactsService as jest.Mocked<
    typeof contactsService
  >;

  beforeEach(() => {
    jest.clearAllMocks();
    mockContactsService.isAvailable.mockReturnValue(true);
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useContacts());

    expect(result.current.contacts).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.permissionGranted).toBe(false);
    expect(result.current.canAskAgain).toBe(true);
  });

  it('should return isAvailable status from service', () => {
    mockContactsService.isAvailable.mockReturnValue(true);
    const { result } = renderHook(() => useContacts());

    expect(result.current.isAvailable).toBe(true);
  });

  describe('requestPermission', () => {
    it('should request permission and update state on success', async () => {
      mockContactsService.requestPermission.mockResolvedValue({
        granted: true,
        canAskAgain: true,
      });

      const { result } = renderHook(() => useContacts());

      let permissionResult: boolean = false;

      await act(async () => {
        permissionResult = await result.current.requestPermission();
      });

      expect(permissionResult).toBe(true);
      expect(result.current.permissionGranted).toBe(true);
      expect(result.current.canAskAgain).toBe(true);
      expect(result.current.error).toBeNull();
    });

    it('should handle permission denial', async () => {
      mockContactsService.requestPermission.mockResolvedValue({
        granted: false,
        canAskAgain: true,
      });

      const { result } = renderHook(() => useContacts());

      let permissionResult: boolean = false;

      await act(async () => {
        permissionResult = await result.current.requestPermission();
      });

      expect(permissionResult).toBe(false);
      expect(result.current.permissionGranted).toBe(false);
      expect(result.current.canAskAgain).toBe(true);
      expect(result.current.error).toBe('Permiso de contactos denegado');
    });

    it('should handle errors when module is not available', async () => {
      mockContactsService.isAvailable.mockReturnValue(false);

      const { result } = renderHook(() => useContacts());

      let permissionResult: boolean = false;

      await act(async () => {
        permissionResult = await result.current.requestPermission();
      });

      expect(permissionResult).toBe(false);
      expect(result.current.error).toBe(
        'El módulo de contactos no está disponible',
      );
    });
  });

  describe('fetchContacts', () => {
    it('should fetch contacts successfully when permission is granted', async () => {
      const mockContacts: Contact[] = [
        { id: '1', name: 'John Doe', phoneNumber: '1234567890' },
        { id: '2', name: 'Jane Smith', phoneNumber: '0987654321' },
      ];

      mockContactsService.requestPermission.mockResolvedValue({
        granted: true,
        canAskAgain: true,
      });
      mockContactsService.getContacts.mockResolvedValue(mockContacts);

      const { result } = renderHook(() => useContacts());

      await act(async () => {
        await result.current.fetchContacts();
      });

      await waitFor(() => {
        expect(result.current.contacts).toEqual(mockContacts);
        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toBeNull();
      });
    });

    it('should request permission before fetching if not granted', async () => {
      const mockContacts: Contact[] = [
        { id: '1', name: 'John Doe', phoneNumber: '1234567890' },
      ];

      mockContactsService.requestPermission.mockResolvedValue({
        granted: true,
        canAskAgain: true,
      });
      mockContactsService.getContacts.mockResolvedValue(mockContacts);

      const { result } = renderHook(() => useContacts());

      await act(async () => {
        await result.current.fetchContacts();
      });

      expect(mockContactsService.requestPermission).toHaveBeenCalled();
      expect(mockContactsService.getContacts).toHaveBeenCalled();
    });

    it('should handle fetch errors', async () => {
      mockContactsService.requestPermission.mockResolvedValue({
        granted: true,
        canAskAgain: true,
      });
      mockContactsService.getContacts.mockRejectedValue(
        new Error('Fetch error'),
      );

      const { result } = renderHook(() => useContacts());

      await act(async () => {
        await result.current.fetchContacts();
      });

      await waitFor(() => {
        expect(result.current.error).toBe('Fetch error');
        expect(result.current.contacts).toEqual([]);
      });
    });

    it('should not fetch if module is not available', async () => {
      mockContactsService.isAvailable.mockReturnValue(false);

      const { result } = renderHook(() => useContacts());

      await act(async () => {
        await result.current.fetchContacts();
      });

      expect(result.current.error).toBe(
        'El módulo de contactos no está disponible',
      );
      expect(mockContactsService.getContacts).not.toHaveBeenCalled();
    });
  });

  describe('reset', () => {
    it('should reset all state to initial values', async () => {
      const mockContacts: Contact[] = [
        { id: '1', name: 'John Doe', phoneNumber: '1234567890' },
      ];

      mockContactsService.requestPermission.mockResolvedValue({
        granted: true,
        canAskAgain: true,
      });
      mockContactsService.getContacts.mockResolvedValue(mockContacts);

      const { result } = renderHook(() => useContacts());

      await act(async () => {
        await result.current.fetchContacts();
      });

      await waitFor(() => {
        expect(result.current.contacts.length).toBeGreaterThan(0);
      });

      act(() => {
        result.current.reset();
      });

      expect(result.current.contacts).toEqual([]);
      expect(result.current.error).toBeNull();
      expect(result.current.isLoading).toBe(false);
      expect(result.current.canAskAgain).toBe(true);
    });

    it('should reset canAskAgain when reset is called', async () => {
      mockContactsService.requestPermission.mockResolvedValue({
        granted: false,
        canAskAgain: false,
      });

      const { result } = renderHook(() => useContacts());

      await act(async () => {
        await result.current.requestPermission();
      });

      expect(result.current.canAskAgain).toBe(false);

      act(() => {
        result.current.reset();
      });

      expect(result.current.canAskAgain).toBe(true);
    });
  });

  describe('canAskAgain tracking', () => {
    it('should track canAskAgain status when permission is denied permanently', async () => {
      mockContactsService.requestPermission.mockResolvedValue({
        granted: false,
        canAskAgain: false,
      });

      const { result } = renderHook(() => useContacts());

      await act(async () => {
        await result.current.requestPermission();
      });

      expect(result.current.canAskAgain).toBe(false);
      expect(result.current.permissionGranted).toBe(false);
    });

    it('should track canAskAgain status when permission can be requested again', async () => {
      mockContactsService.requestPermission.mockResolvedValue({
        granted: false,
        canAskAgain: true,
      });

      const { result } = renderHook(() => useContacts());

      await act(async () => {
        await result.current.requestPermission();
      });

      expect(result.current.canAskAgain).toBe(true);
      expect(result.current.permissionGranted).toBe(false);
    });
  });
});
