import {NativeModules} from 'react-native';
import {contactsService} from '../ContactsService';
import {Contact, ContactsPermissionStatus} from '@/types/contacts';

jest.mock('react-native', () => ({
  NativeModules: {
    ContactsModule: {
      requestPermission: jest.fn(),
      getContacts: jest.fn(),
    },
  },
  Platform: {
    OS: 'ios',
  },
}));

describe('ContactsService', () => {
  const mockContactsModule = NativeModules.ContactsModule;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('isAvailable', () => {
    it('should return true when ContactsModule is available', () => {
      expect(contactsService.isAvailable()).toBe(true);
    });
  });

  describe('requestPermission', () => {
    it('should return granted permission status when user grants permission', async () => {
      const mockResponse: ContactsPermissionStatus = {
        granted: true,
        canAskAgain: true,
      };

      (mockContactsModule.requestPermission as jest.Mock).mockResolvedValue(mockResponse);

      const result = await contactsService.requestPermission();

      expect(result).toEqual(mockResponse);
      expect(mockContactsModule.requestPermission).toHaveBeenCalledTimes(1);
    });

    it('should return denied permission status when user denies permission', async () => {
      const mockResponse: ContactsPermissionStatus = {
        granted: false,
        canAskAgain: true,
      };

      (mockContactsModule.requestPermission as jest.Mock).mockResolvedValue(mockResponse);

      const result = await contactsService.requestPermission();

      expect(result).toEqual(mockResponse);
      expect(result.granted).toBe(false);
    });

    it('should handle errors gracefully and return denied status', async () => {
      (mockContactsModule.requestPermission as jest.Mock).mockRejectedValue(
        new Error('Permission error')
      );

      const result = await contactsService.requestPermission();

      expect(result).toEqual({
        granted: false,
        canAskAgain: false,
      });
    });
  });

  describe('getContacts', () => {
    it('should return list of contacts when permission is granted', async () => {
      const mockContacts: Contact[] = [
        {id: '1', name: 'John Doe', phoneNumber: '1234567890'},
        {id: '2', name: 'Jane Smith', phoneNumber: '0987654321'},
      ];

      (mockContactsModule.getContacts as jest.Mock).mockResolvedValue(mockContacts);

      const result = await contactsService.getContacts();

      expect(result).toEqual(mockContacts);
      expect(mockContactsModule.getContacts).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no contacts exist', async () => {
      (mockContactsModule.getContacts as jest.Mock).mockResolvedValue([]);

      const result = await contactsService.getContacts();

      expect(result).toEqual([]);
    });

    it('should throw error when permission is denied', async () => {
      const error = new Error('Permission denied');
      (mockContactsModule.getContacts as jest.Mock).mockRejectedValue(error);

      await expect(contactsService.getContacts()).rejects.toThrow('Permission denied');
    });

    it('should handle native module errors', async () => {
      const error = new Error('Native module error');
      (mockContactsModule.getContacts as jest.Mock).mockRejectedValue(error);

      await expect(contactsService.getContacts()).rejects.toThrow();
    });
  });
});
