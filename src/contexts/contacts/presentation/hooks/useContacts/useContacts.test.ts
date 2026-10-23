import { renderHook, act } from '@testing-library/react-native';
import { useContacts } from './useContacts';
import { RequestContactsPermissionUseCase } from '../../../application/use-cases/RequestContactsPermissionUseCase';
import { GetContactsUseCase } from '../../../application/use-cases/GetContactsUseCase';
import { Contact } from '../../../domain/entities/Contact';
import { ContactsPermissionStatus } from '../../../domain/value-objects/ContactsPermissionStatus';
import { Result } from '@/shared/domain/result/Result';
import { ContactsUnavailableError } from '../../../domain/errors/ContactsUnavailableError';

describe('useContacts', () => {
  let mockRequestPermissionUseCase: jest.Mocked<RequestContactsPermissionUseCase>;
  let mockGetContactsUseCase: jest.Mocked<GetContactsUseCase>;

  beforeEach(() => {
    mockRequestPermissionUseCase = {
      execute: jest.fn(),
    } as any;

    mockGetContactsUseCase = {
      execute: jest.fn(),
    } as any;
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() =>
      useContacts(mockRequestPermissionUseCase, mockGetContactsUseCase, true),
    );

    expect(result.current.contacts).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.permissionGranted).toBe(false);
    expect(result.current.canAskAgain).toBe(true);
    expect(result.current.isAvailable).toBe(true);
  });

  it('should return isAvailable as false when module is unavailable', () => {
    const { result } = renderHook(() =>
      useContacts(mockRequestPermissionUseCase, mockGetContactsUseCase, false),
    );

    expect(result.current.isAvailable).toBe(false);
  });

  it('should request permission successfully', async () => {
    const permissionStatus = new ContactsPermissionStatus(true, false);
    mockRequestPermissionUseCase.execute.mockResolvedValue(
      Result.ok(permissionStatus),
    );

    const { result } = renderHook(() =>
      useContacts(mockRequestPermissionUseCase, mockGetContactsUseCase, true),
    );

    let permissionGranted = false;
    await act(async () => {
      permissionGranted = await result.current.requestPermission();
    });

    expect(permissionGranted).toBe(true);
    expect(result.current.permissionGranted).toBe(true);
    expect(result.current.canAskAgain).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should handle permission denial', async () => {
    const permissionStatus = new ContactsPermissionStatus(false, true);
    mockRequestPermissionUseCase.execute.mockResolvedValue(
      Result.ok(permissionStatus),
    );

    const { result } = renderHook(() =>
      useContacts(mockRequestPermissionUseCase, mockGetContactsUseCase, true),
    );

    let permissionGranted = false;
    await act(async () => {
      permissionGranted = await result.current.requestPermission();
    });

    expect(permissionGranted).toBe(false);
    expect(result.current.permissionGranted).toBe(false);
    expect(result.current.error).toBe('Permiso de contactos denegado');
  });

  it('should handle permission request error', async () => {
    const error = new ContactsUnavailableError();
    mockRequestPermissionUseCase.execute.mockResolvedValue(Result.fail(error));

    const { result } = renderHook(() =>
      useContacts(mockRequestPermissionUseCase, mockGetContactsUseCase, true),
    );

    let permissionGranted = false;
    await act(async () => {
      permissionGranted = await result.current.requestPermission();
    });

    expect(permissionGranted).toBe(false);
    expect(result.current.error).toBe(error.message);
  });

  it('should fetch contacts successfully', async () => {
    const contacts = [
      new Contact('1', 'John Doe', '+1234567890'),
      new Contact('2', 'Jane Doe', '+0987654321'),
    ];
    const permissionStatus = new ContactsPermissionStatus(true, false);

    mockRequestPermissionUseCase.execute.mockResolvedValue(
      Result.ok(permissionStatus),
    );
    mockGetContactsUseCase.execute.mockResolvedValue(Result.ok(contacts));

    const { result } = renderHook(() =>
      useContacts(mockRequestPermissionUseCase, mockGetContactsUseCase, true),
    );

    await act(async () => {
      await result.current.fetchContacts();
    });

    expect(result.current.contacts).toEqual(contacts);
    expect(result.current.error).toBeNull();
  });

  it('should request permission before fetching contacts if not granted', async () => {
    const contacts = [new Contact('1', 'John Doe', '+1234567890')];
    const permissionStatus = new ContactsPermissionStatus(true, false);

    mockRequestPermissionUseCase.execute.mockResolvedValue(
      Result.ok(permissionStatus),
    );
    mockGetContactsUseCase.execute.mockResolvedValue(Result.ok(contacts));

    const { result } = renderHook(() =>
      useContacts(mockRequestPermissionUseCase, mockGetContactsUseCase, true),
    );

    await act(async () => {
      await result.current.fetchContacts();
    });

    expect(mockRequestPermissionUseCase.execute).toHaveBeenCalled();
    expect(mockGetContactsUseCase.execute).toHaveBeenCalled();
  });

  it('should reset state', () => {
    const { result } = renderHook(() =>
      useContacts(mockRequestPermissionUseCase, mockGetContactsUseCase, true),
    );

    act(() => {
      result.current.reset();
    });

    expect(result.current.contacts).toEqual([]);
    expect(result.current.error).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.canAskAgain).toBe(true);
  });

  it('should return error when module is unavailable', async () => {
    const { result } = renderHook(() =>
      useContacts(mockRequestPermissionUseCase, mockGetContactsUseCase, false),
    );

    let permissionGranted = false;
    await act(async () => {
      permissionGranted = await result.current.requestPermission();
    });

    expect(permissionGranted).toBe(false);
    expect(result.current.error).toBe(
      'El módulo de contactos no está disponible',
    );
  });
});
