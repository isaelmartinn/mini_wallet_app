import { Result } from '@/shared/domain/result/Result';
import { IContactsRepository } from '../../domain/repositories/IContactsRepository';
import { Contact } from '../../domain/entities/Contact';

/**
 * GetContactsUseCase
 * Orchestrates the retrieval of contacts.
 */
export class GetContactsUseCase {
  constructor(private readonly repository: IContactsRepository) {}

  async execute(): Promise<Result<Contact[]>> {
    return this.repository.getContacts();
  }
}
