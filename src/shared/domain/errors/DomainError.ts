/**
 * Base class for all domain and application errors.
 * Provides a consistent error structure across the application.
 */
export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, DomainError.prototype);
  }
}
