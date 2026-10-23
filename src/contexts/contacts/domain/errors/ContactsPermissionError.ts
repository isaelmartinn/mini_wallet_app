/**
 * ContactsPermissionError
 * Thrown when permission to access contacts is denied.
 */
export class ContactsPermissionError extends Error {
  constructor(message: string = 'Permiso de contactos denegado') {
    super(message);
    this.name = 'ContactsPermissionError';
  }
}
