/**
 * Contact Entity
 * Represents a contact with identity and immutable properties.
 */
export class Contact {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly phoneNumber: string,
  ) {}

  /**
   * Creates a Contact from plain object (DTO).
   */
  static fromDTO(dto: {
    id: string;
    name: string;
    phoneNumber: string;
  }): Contact {
    return new Contact(dto.id, dto.name, dto.phoneNumber);
  }

  /**
   * Converts Contact to plain object.
   */
  toDTO(): { id: string; name: string; phoneNumber: string } {
    return {
      id: this.id,
      name: this.name,
      phoneNumber: this.phoneNumber,
    };
  }
}
