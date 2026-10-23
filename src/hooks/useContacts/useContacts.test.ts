/**
 * Wrapper Hook Test
 * Tests the wrapper hook in src/hooks/useContacts/useContacts.ts
 * which bridges the old hook location to the new hexagonal context.
 *
 * This test verifies that the wrapper correctly injects dependencies
 * from the DI container and delegates to the core hook.
 */

import { renderHook, act } from '@testing-library/react-native';
import { useContacts } from './useContacts';
import { di } from '@/core/dependency-injection';
import { Contact } from '@/contexts/contacts/domain/entities/Contact';
import { ContactsPermissionStatus } from '@/contexts/contacts/domain/value-objects/ContactsPermissionStatus';
import { Result } from '@/shared/domain/result/Result';

jest.mock('@/core/dependency-injection', () => ({
  di: {
    contacts: {
      requestPermissionUseCase: {
        execute: jest.fn(),
      },
      getContactsUseCase: {
        execute: jest.fn(),
      },
      isAvailable: true,
    },
  },
}));

describe('useContacts (Wrapper Hook)', () => {
  let mockRequestPermissionUseCase: any;
  let mockGetContactsUseCase: any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRequestPermissionUseCase = di.contacts.requestPermissionUseCase;
    mockGetContactsUseCase = di.contacts.getContactsUseCase;
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useContacts());

    expect(result.current.contacts).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.permissionGranted).toBe(false);
    expect(result.current.canAskAgain).toBe(true);
    expect(result.current.isAvailable).toBe(true);
  });

  it('should request permission successfully', async () => {
    const permissionStatus = new ContactsPermissionStatus(true, false);
    mockRequestPermissionUseCase.execute.mockResolvedValue(
      Result.ok(permissionStatus),
    );

    const { result } = renderHook(() => useContacts());

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

    const { result } = renderHook(() => useContacts());

    let permissionGranted = false;
    await act(async () => {
      permissionGranted = await result.current.requestPermission();
    });

    expect(permissionGranted).toBe(false);
    expect(result.current.permissionGranted).toBe(false);
    expect(result.current.error).toBe('Permiso de contactos denegado');
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

    const { result } = renderHook(() => useContacts());

    await act(async () => {
      await result.current.fetchContacts();
    });

    expect(result.current.contacts).toEqual(contacts);
    expect(result.current.error).toBeNull();
  });

  it('should reset state', () => {
    const { result } = renderHook(() => useContacts());

    act(() => {
      result.current.reset();
    });

    expect(result.current.contacts).toEqual([]);
    expect(result.current.error).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.canAskAgain).toBe(true);
  });
});
