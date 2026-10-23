import { NativeContactsRepository } from '@/contexts/contacts/infrastructure/repositories/NativeContactsRepository';
import { RequestContactsPermissionUseCase } from '@/contexts/contacts/application/use-cases/RequestContactsPermissionUseCase';
import { GetContactsUseCase } from '@/contexts/contacts/application/use-cases/GetContactsUseCase';

/**
 * Contacts context provider.
 * Provides dependency injection for contacts-related use cases and repositories.
 */
const repository = new NativeContactsRepository();

export const ContactsProvider = {
  repository,
  requestPermissionUseCase: new RequestContactsPermissionUseCase(repository),
  getContactsUseCase: new GetContactsUseCase(repository),
  isAvailable: repository.isAvailable(),
};
