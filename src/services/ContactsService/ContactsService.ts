import {NativeModules, Platform} from 'react-native';
import {Contact, ContactsPermissionStatus, ContactsModuleInterface} from '@/types/contacts';

const {ContactsModule} = NativeModules;

class ContactsService implements ContactsModuleInterface {
  private validateModule(): void {
    if (!ContactsModule) {
      throw new Error('ContactsModule is not available. Make sure native module is properly linked.');
    }
  }

  async requestPermission(): Promise<ContactsPermissionStatus> {
    try {
      this.validateModule();
      const result = await ContactsModule.requestPermission();
      return result;
    } catch (error) {
      return {
        granted: false,
        canAskAgain: false,
      };
    }
  }

  async getContacts(): Promise<Contact[]> {
    try {
      this.validateModule();
      const contacts = await ContactsModule.getContacts();
      return contacts;
    } catch (error) {
      throw error;
    }
  }

  isAvailable(): boolean {
    return ContactsModule !== null && ContactsModule !== undefined;
  }
}

export const contactsService = new ContactsService();
