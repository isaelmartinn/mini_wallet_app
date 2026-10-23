import { RequestContactsPermissionUseCase } from './RequestContactsPermissionUseCase';
import { IContactsRepository } from '../../domain/repositories/IContactsRepository';
import { ContactsPermissionStatus } from '../../domain/value-objects/ContactsPermissionStatus';
import { Result } from '@/shared/domain/result/Result';
import { ContactsUnavailableError } from '../../domain/errors/ContactsUnavailableError';

describe('RequestContactsPermissionUseCase', () => {
  let useCase: RequestContactsPermissionUseCase;
  let mockRepository: jest.Mocked<IContactsRepository>;

  beforeEach(() => {
    mockRepository = {
      requestPermission: jest.fn(),
      getContacts: jest.fn(),
      isAvailable: jest.fn(),
    };
    useCase = new RequestContactsPermissionUseCase(mockRepository);
  });

  it('should return permission status when repository succeeds', async () => {
    const permissionStatus = new ContactsPermissionStatus(true, false);
    mockRepository.requestPermission.mockResolvedValue(
      Result.ok(permissionStatus),
    );

    const result = await useCase.execute();

    expect(result.isOk()).toBe(true);
    expect(result.value).toEqual(permissionStatus);
  });

  it('should return error when repository fails', async () => {
    const error = new ContactsUnavailableError();
    mockRepository.requestPermission.mockResolvedValue(Result.fail(error));

    const result = await useCase.execute();

    expect(result.isFail()).toBe(true);
    expect(result.error).toEqual(error);
  });

  it('should call repository requestPermission method', async () => {
    const permissionStatus = new ContactsPermissionStatus(false, true);
    mockRepository.requestPermission.mockResolvedValue(
      Result.ok(permissionStatus),
    );

    await useCase.execute();

    expect(mockRepository.requestPermission).toHaveBeenCalledTimes(1);
  });
});
