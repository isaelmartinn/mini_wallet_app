import { GetContactsUseCase } from './GetContactsUseCase';
import { IContactsRepository } from '../../domain/repositories/IContactsRepository';
import { Contact } from '../../domain/entities/Contact';
import { Result } from '@/shared/domain/result/Result';
import { ContactsPermissionError } from '../../domain/errors/ContactsPermissionError';

describe('GetContactsUseCase', () => {
  let useCase: GetContactsUseCase;
  let mockRepository: jest.Mocked<IContactsRepository>;

  beforeEach(() => {
    mockRepository = {
      requestPermission: jest.fn(),
      getContacts: jest.fn(),
      isAvailable: jest.fn(),
    };
    useCase = new GetContactsUseCase(mockRepository);
  });

  it('should return contacts when repository succeeds', async () => {
    const contacts = [
      new Contact('1', 'John Doe', '+1234567890'),
      new Contact('2', 'Jane Doe', '+0987654321'),
    ];
    mockRepository.getContacts.mockResolvedValue(Result.ok(contacts));

    const result = await useCase.execute();

    expect(result.isOk()).toBe(true);
    expect(result.value).toEqual(contacts);
    expect(result.value).toHaveLength(2);
  });

  it('should return error when repository fails', async () => {
    const error = new ContactsPermissionError();
    mockRepository.getContacts.mockResolvedValue(Result.fail(error));

    const result = await useCase.execute();

    expect(result.isFail()).toBe(true);
    expect(result.error).toEqual(error);
  });

  it('should return empty array when no contacts available', async () => {
    mockRepository.getContacts.mockResolvedValue(Result.ok([]));

    const result = await useCase.execute();

    expect(result.isOk()).toBe(true);
    expect(result.value).toEqual([]);
  });

  it('should call repository getContacts method', async () => {
    const contacts = [new Contact('1', 'John Doe', '+1234567890')];
    mockRepository.getContacts.mockResolvedValue(Result.ok(contacts));

    await useCase.execute();

    expect(mockRepository.getContacts).toHaveBeenCalledTimes(1);
  });
});
