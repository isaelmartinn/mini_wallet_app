export interface Contact {
  id: string;
  name: string;
  phoneNumber: string;
}

export interface ContactsPermissionStatus {
  granted: boolean;
  canAskAgain: boolean;
}

export interface ContactsModuleInterface {
  requestPermission(): Promise<ContactsPermissionStatus>;
  getContacts(): Promise<Contact[]>;
}
