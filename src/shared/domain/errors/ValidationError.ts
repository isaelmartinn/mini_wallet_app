import { DomainError } from './DomainError';

/**
 * Error thrown when validation fails.
 * Extends DomainError for consistent error handling.
 */
export class ValidationError extends DomainError {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}
