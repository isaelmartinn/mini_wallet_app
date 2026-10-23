import { ContactsPermissionStatus } from './ContactsPermissionStatus';

describe('ContactsPermissionStatus', () => {
  it('should create a permission status with granted and canAskAgain', () => {
    const status = new ContactsPermissionStatus(true, false);

    expect(status.granted).toBe(true);
    expect(status.canAskAgain).toBe(false);
  });

  it('should create from DTO', () => {
    const dto = { granted: false, canAskAgain: true };
    const status = ContactsPermissionStatus.fromDTO(dto);

    expect(status.granted).toBe(false);
    expect(status.canAskAgain).toBe(true);
  });

  it('should convert to DTO', () => {
    const status = new ContactsPermissionStatus(true, false);
    const dto = status.toDTO();

    expect(dto).toEqual({
      granted: true,
      canAskAgain: false,
    });
  });

  it('should compare equality by value', () => {
    const status1 = new ContactsPermissionStatus(true, false);
    const status2 = new ContactsPermissionStatus(true, false);
    const status3 = new ContactsPermissionStatus(false, true);

    expect(status1.equals(status2)).toBe(true);
    expect(status1.equals(status3)).toBe(false);
  });
});
