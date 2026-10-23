import { NativeModules } from 'react-native';
import { Result } from '@/shared/domain/result/Result';
import { IContactsRepository } from '../../domain/repositories/IContactsRepository';
import { Contact } from '../../domain/entities/Contact';
import { ContactsPermissionStatus } from '../../domain/value-objects/ContactsPermissionStatus';
import { ContactsUnavailableError } from '../../domain/errors/ContactsUnavailableError';
import { ContactsPermissionError } from '../../domain/errors/ContactsPermissionError';

const { ContactsModule } = NativeModules;

/**
 * NativeContactsRepository
 * Adapter that implements IContactsRepository using React Native's NativeModules.
 * Handles graceful degradation when the native module is unavailable.
 */
export class NativeContactsRepository implements IContactsRepository {
  isAvailable(): boolean {
    return ContactsModule !== null && ContactsModule !== undefined;
  }

  async requestPermission(): Promise<Result<ContactsPermissionStatus>> {
    try {
      if (!this.isAvailable()) {
        return Result.fail(
          new ContactsUnavailableError(
            'ContactsModule is not available. Make sure native module is properly linked.',
          ),
        );
      }

      const result = await ContactsModule.requestPermission();
      const status = ContactsPermissionStatus.fromDTO(result);
      return Result.ok(status);
    } catch (error) {
      // If permission request fails, return denied status gracefully
      const deniedStatus = new ContactsPermissionStatus(false, false);
      return Result.ok(deniedStatus);
    }
  }

  async getContacts(): Promise<Result<Contact[]>> {
    try {
      if (!this.isAvailable()) {
        return Result.fail(
          new ContactsUnavailableError(
            'ContactsModule is not available. Make sure native module is properly linked.',
          ),
        );
      }

      const contacts = await ContactsModule.getContacts();
      const contactEntities = contacts.map((dto: any) => Contact.fromDTO(dto));
      return Result.ok(contactEntities);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error al obtener contactos';
      return Result.fail(new ContactsPermissionError(errorMessage));
    }
  }
}
