/**
 * ContactsPermissionStatus Value Object
 * Represents the permission status for accessing contacts.
 * Immutable and compared by value.
 */
export class ContactsPermissionStatus {
  constructor(readonly granted: boolean, readonly canAskAgain: boolean) {}

  /**
   * Creates a ContactsPermissionStatus from plain object.
   */
  static fromDTO(dto: {
    granted: boolean;
    canAskAgain: boolean;
  }): ContactsPermissionStatus {
    return new ContactsPermissionStatus(dto.granted, dto.canAskAgain);
  }

  /**
   * Converts to plain object.
   */
  toDTO(): { granted: boolean; canAskAgain: boolean } {
    return {
      granted: this.granted,
      canAskAgain: this.canAskAgain,
    };
  }

  /**
   * Checks equality by value.
   */
  equals(other: ContactsPermissionStatus): boolean {
    return (
      this.granted === other.granted && this.canAskAgain === other.canAskAgain
    );
  }
}
