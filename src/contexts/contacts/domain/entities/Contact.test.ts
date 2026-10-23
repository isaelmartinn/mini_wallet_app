import { Contact } from './Contact';

describe('Contact', () => {
  it('should create a contact with id, name, and phoneNumber', () => {
    const contact = new Contact('1', 'John Doe', '+1234567890');

    expect(contact.id).toBe('1');
    expect(contact.name).toBe('John Doe');
    expect(contact.phoneNumber).toBe('+1234567890');
  });

  it('should create a contact from DTO', () => {
    const dto = { id: '1', name: 'Jane Doe', phoneNumber: '+0987654321' };
    const contact = Contact.fromDTO(dto);

    expect(contact.id).toBe('1');
    expect(contact.name).toBe('Jane Doe');
    expect(contact.phoneNumber).toBe('+0987654321');
  });

  it('should convert contact to DTO', () => {
    const contact = new Contact('1', 'John Doe', '+1234567890');
    const dto = contact.toDTO();

    expect(dto).toEqual({
      id: '1',
      name: 'John Doe',
      phoneNumber: '+1234567890',
    });
  });
});
