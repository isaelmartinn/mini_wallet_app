import { Result } from '@/shared/domain/result/Result';
import { Contact } from '../entities/Contact';
import { ContactsPermissionStatus } from '../value-objects/ContactsPermissionStatus';

/**
 * IContactsRepository
 * Port interface for accessing contacts and managing permissions.
 * Implementations should handle native module interactions.
 */
export interface IContactsRepository {
  /**
   * Requests permission to access contacts.
   * Returns the permission status or an error.
   */
  requestPermission(): Promise<Result<ContactsPermissionStatus>>;

  /**
   * Retrieves all available contacts.
   * Returns a list of contacts or an error.
   */
  getContacts(): Promise<Result<Contact[]>>;

  /**
   * Checks if the native contacts module is available.
   */
  isAvailable(): boolean;
}
