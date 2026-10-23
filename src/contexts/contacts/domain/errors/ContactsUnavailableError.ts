/**
 * ContactsUnavailableError
 * Thrown when the native contacts module is not available.
 */
export class ContactsUnavailableError extends Error {
  constructor(message: string = 'El módulo de contactos no está disponible') {
    super(message);
    this.name = 'ContactsUnavailableError';
  }
}
