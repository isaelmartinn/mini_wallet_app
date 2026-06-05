export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PHONE_REGEX = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const validateEmail = (email: string): ValidationResult => {
  if (!email.trim()) {
    return {isValid: false, error: 'El email es requerido'};
  }
  if (!EMAIL_REGEX.test(email)) {
    return {isValid: false, error: 'El formato del email no es válido'};
  }
  return {isValid: true};
};

export const validatePhone = (phone: string): ValidationResult => {
  if (!phone.trim()) {
    return {isValid: false, error: 'El teléfono es requerido'};
  }
  if (!PHONE_REGEX.test(phone)) {
    return {isValid: false, error: 'El formato del teléfono no es válido'};
  }
  return {isValid: true};
};

export const validateIdentifier = (identifier: string): ValidationResult => {
  if (!identifier.trim()) {
    return {isValid: false, error: 'Este campo es requerido'};
  }

  const emailValidation = validateEmail(identifier);
  const phoneValidation = validatePhone(identifier);

  if (emailValidation.isValid || phoneValidation.isValid) {
    return {isValid: true};
  }

  return {
    isValid: false,
    error: 'Ingresa un email o teléfono válido',
  };
};
