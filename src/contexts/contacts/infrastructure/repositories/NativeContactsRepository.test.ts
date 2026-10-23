import { NativeModules } from 'react-native';
import { NativeContactsRepository } from './NativeContactsRepository';
import { ContactsUnavailableError } from '../../domain/errors/ContactsUnavailableError';
import { ContactsPermissionError } from '../../domain/errors/ContactsPermissionError';

jest.mock('react-native', () => ({
  NativeModules: {
    ContactsModule: null,
  },
}));

describe('NativeContactsRepository', () => {
  let repository: NativeContactsRepository;

  beforeEach(() => {
    repository = new NativeContactsRepository();
    jest.clearAllMocks();
  });

  describe('isAvailable', () => {
    it('should return false when ContactsModule is not available', () => {
      (NativeModules.ContactsModule as any) = null;
      expect(repository.isAvailable()).toBe(false);
    });

    it('should return true when ContactsModule is available', () => {
      (NativeModules.ContactsModule as any) = { requestPermission: jest.fn() };
      expect(repository.isAvailable()).toBe(true);
    });
  });

  describe('requestPermission', () => {
    it('should return ContactsUnavailableError when module is not available', async () => {
      (NativeModules.ContactsModule as any) = null;
      const result = await repository.requestPermission();

      expect(result.isFail()).toBe(true);
      expect(result.error).toBeInstanceOf(ContactsUnavailableError);
    });

    it('should return permission status when module is available', async () => {
      const mockPermissionStatus = { granted: true, canAskAgain: false };
      (NativeModules.ContactsModule as any) = {
        requestPermission: jest.fn().mockResolvedValue(mockPermissionStatus),
      };

      const result = await repository.requestPermission();

      expect(result.isOk()).toBe(true);
      expect(result.value?.granted).toBe(true);
      expect(result.value?.canAskAgain).toBe(false);
    });

    it('should return denied status gracefully on error', async () => {
      (NativeModules.ContactsModule as any) = {
        requestPermission: jest
          .fn()
          .mockRejectedValue(new Error('Native error')),
      };

      const result = await repository.requestPermission();

      expect(result.isOk()).toBe(true);
      expect(result.value?.granted).toBe(false);
      expect(result.value?.canAskAgain).toBe(false);
    });
  });

  describe('getContacts', () => {
    it('should return ContactsUnavailableError when module is not available', async () => {
      (NativeModules.ContactsModule as any) = null;
      const result = await repository.getContacts();

      expect(result.isFail()).toBe(true);
      expect(result.error).toBeInstanceOf(ContactsUnavailableError);
    });

    it('should return contacts when module is available', async () => {
      const mockContacts = [
        { id: '1', name: 'John Doe', phoneNumber: '+1234567890' },
        { id: '2', name: 'Jane Doe', phoneNumber: '+0987654321' },
      ];
      (NativeModules.ContactsModule as any) = {
        getContacts: jest.fn().mockResolvedValue(mockContacts),
      };

      const result = await repository.getContacts();

      expect(result.isOk()).toBe(true);
      expect(result.value).toHaveLength(2);
      expect(result.value?.[0].name).toBe('John Doe');
      expect(result.value?.[1].phoneNumber).toBe('+0987654321');
    });

    it('should return error when getContacts fails', async () => {
      (NativeModules.ContactsModule as any) = {
        getContacts: jest
          .fn()
          .mockRejectedValue(new Error('Permission denied')),
      };

      const result = await repository.getContacts();

      expect(result.isFail()).toBe(true);
      expect(result.error).toBeInstanceOf(ContactsPermissionError);
    });
  });
});
