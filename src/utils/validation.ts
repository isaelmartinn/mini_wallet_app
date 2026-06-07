export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PHONE_REGEX = /^\+52\d{10}$/;

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
  const cleanPhone = phone.trim();
  
  if (!cleanPhone) {
    return {isValid: false, error: 'El teléfono es requerido'};
  }
  
  if (!cleanPhone.startsWith('+52')) {
    return {
      isValid: false,
      error: 'El teléfono debe iniciar con +52',
    };
  }
  
  const digits = cleanPhone.replace('+52', '');
  
  if (digits.length !== 10) {
    return {
      isValid: false,
      error: 'El teléfono debe tener 10 dígitos después de +52',
    };
  }
  
  if (!/^\d{10}$/.test(digits)) {
    return {
      isValid: false,
      error: 'El teléfono solo debe contener números',
    };
  }
  
  if (!PHONE_REGEX.test(cleanPhone)) {
    return {
      isValid: false,
      error: 'El formato del teléfono no es válido',
    };
  }
  
  return {isValid: true};
};

export const validateIdentifier = (identifier: string): ValidationResult => {
  const cleanIdentifier = identifier.trim();

  if (!cleanIdentifier) {
    return {isValid: false, error: 'Este campo es requerido'};
  }

  const isPhone = cleanIdentifier.startsWith('+52') || /^\d/.test(cleanIdentifier);

  if (isPhone) {
    return validatePhone(cleanIdentifier);
  }

  return validateEmail(cleanIdentifier);
};
