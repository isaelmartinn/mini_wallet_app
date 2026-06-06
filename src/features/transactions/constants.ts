export const TRANSACTION_RULES = {
  MIN_AMOUNT: 1,
  MIN_RECIPIENT_NAME_LENGTH: 3,
  MIN_ACCOUNT_LENGTH: 10,
  DEFAULT_FEE: 0,
} as const;

export const TRANSACTION_ERRORS = {
  AMOUNT_ZERO: 'El monto debe ser mayor a 0',
  AMOUNT_EXCEEDS_BALANCE: 'Saldo insuficiente',
  RECIPIENT_NAME_REQUIRED: 'El nombre es requerido',
  RECIPIENT_NAME_TOO_SHORT: 'El nombre debe tener al menos 3 caracteres',
  RECIPIENT_ACCOUNT_REQUIRED: 'La cuenta o teléfono es requerido',
  RECIPIENT_ACCOUNT_INVALID: 'Ingresa un número de teléfono válido (10 dígitos)',
  INSUFFICIENT_FUNDS: 'No tienes saldo suficiente para completar esta transacción',
  NETWORK_ERROR: 'Error de conexión. Por favor, intenta nuevamente',
  TIMEOUT: 'La transacción tardó demasiado. Intenta de nuevo',
  UNKNOWN: 'Ocurrió un error inesperado. Por favor, intenta más tarde',
} as const;
