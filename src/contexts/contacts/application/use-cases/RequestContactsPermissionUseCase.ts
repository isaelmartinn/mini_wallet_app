import { Result } from '@/shared/domain/result/Result';
import { IContactsRepository } from '../../domain/repositories/IContactsRepository';
import { ContactsPermissionStatus } from '../../domain/value-objects/ContactsPermissionStatus';

/**
 * RequestContactsPermissionUseCase
 * Orchestrates the request for contacts permission.
 */
export class RequestContactsPermissionUseCase {
  constructor(private readonly repository: IContactsRepository) {}

  async execute(): Promise<Result<ContactsPermissionStatus>> {
    return this.repository.requestPermission();
  }
}
