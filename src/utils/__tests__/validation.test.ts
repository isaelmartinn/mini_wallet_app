import {
  validateEmail,
  validatePhone,
  validateIdentifier,
  EMAIL_REGEX,
  PHONE_REGEX,
} from '../validation';

describe('validation utils', () => {
  describe('EMAIL_REGEX', () => {
    it('should match valid email formats', () => {
      expect(EMAIL_REGEX.test('test@example.com')).toBe(true);
      expect(EMAIL_REGEX.test('user.name@domain.co')).toBe(true);
      expect(EMAIL_REGEX.test('user+tag@example.com')).toBe(true);
    });

    it('should not match invalid email formats', () => {
      expect(EMAIL_REGEX.test('invalid')).toBe(false);
      expect(EMAIL_REGEX.test('@example.com')).toBe(false);
      expect(EMAIL_REGEX.test('user@')).toBe(false);
      expect(EMAIL_REGEX.test('user@domain')).toBe(false);
    });
  });

  describe('PHONE_REGEX', () => {
    it('should match valid Mexican phone format (+52 + 10 digits)', () => {
      expect(PHONE_REGEX.test('+523314530322')).toBe(true);
      expect(PHONE_REGEX.test('+525512345678')).toBe(true);
      expect(PHONE_REGEX.test('+521234567890')).toBe(true);
    });

    it('should not match invalid phone formats', () => {
      expect(PHONE_REGEX.test('3314530322')).toBe(false);
      expect(PHONE_REGEX.test('+52331453032')).toBe(false);
      expect(PHONE_REGEX.test('+5233145303222')).toBe(false);
      expect(PHONE_REGEX.test('+52 331 453 0322')).toBe(false);
      expect(PHONE_REGEX.test('+52-331-453-0322')).toBe(false);
      expect(PHONE_REGEX.test('+1234567890')).toBe(false);
    });

    it('should not match phone numbers with more than 10 digits', () => {
      expect(PHONE_REGEX.test('+52331453032299')).toBe(false);
      expect(PHONE_REGEX.test('+5233145303229988')).toBe(false);
      expect(PHONE_REGEX.test('+523314530322998877')).toBe(false);
    });
  });

  describe('validateEmail', () => {
    it('should validate correct email addresses', () => {
      const result = validateEmail('test@example.com');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject empty email', () => {
      const result = validateEmail('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('El email es requerido');
    });

    it('should reject email with only spaces', () => {
      const result = validateEmail('   ');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('El email es requerido');
    });

    it('should reject invalid email format', () => {
      const result = validateEmail('invalid-email');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('El formato del email no es válido');
    });
  });

  describe('validatePhone', () => {
    it('should validate correct Mexican phone number', () => {
      const result = validatePhone('+523314530322');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject empty phone', () => {
      const result = validatePhone('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('El teléfono es requerido');
    });

    it('should reject phone without +52 prefix', () => {
      const result = validatePhone('3314530322');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('El teléfono debe iniciar con +52');
    });

    it('should reject phone with less than 10 digits', () => {
      const result = validatePhone('+52331453032');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('El teléfono debe tener 10 dígitos después de +52');
    });

    it('should reject phone with more than 10 digits', () => {
      const result1 = validatePhone('+52331453032299');
      expect(result1.isValid).toBe(false);
      expect(result1.error).toBe('El teléfono debe tener 10 dígitos después de +52');

      const result2 = validatePhone('+5233145303229988');
      expect(result2.isValid).toBe(false);
      expect(result2.error).toBe('El teléfono debe tener 10 dígitos después de +52');

      const result3 = validatePhone('+523314530322998877');
      expect(result3.isValid).toBe(false);
      expect(result3.error).toBe('El teléfono debe tener 10 dígitos después de +52');
    });

    it('should reject phone with non-numeric characters', () => {
      const result = validatePhone('+52331abc0322');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('El teléfono solo debe contener números');
    });

    it('should trim whitespace before validation', () => {
      const result = validatePhone('  +523314530322  ');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });
  });

  describe('validateIdentifier', () => {
    it('should accept valid email', () => {
      const result = validateIdentifier('test@example.com');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should accept valid phone with +52 prefix', () => {
      const result = validateIdentifier('+523314530322');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject empty identifier', () => {
      const result = validateIdentifier('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Este campo es requerido');
    });

    it('should reject invalid email format', () => {
      const result = validateIdentifier('invalid-email');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('El formato del email no es válido');
    });

    it('should reject email with @ but invalid format', () => {
      const result = validateIdentifier('invalid@');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('El formato del email no es válido');
    });

    it('should reject phone numbers with more than 10 digits', () => {
      const result1 = validateIdentifier('+52331453032299');
      expect(result1.isValid).toBe(false);
      expect(result1.error).toBe('El teléfono debe tener 10 dígitos después de +52');

      const result2 = validateIdentifier('+5233145303229988');
      expect(result2.isValid).toBe(false);
      expect(result2.error).toBe('El teléfono debe tener 10 dígitos después de +52');

      const result3 = validateIdentifier('+523314530322998877');
      expect(result3.isValid).toBe(false);
      expect(result3.error).toBe('El teléfono debe tener 10 dígitos después de +52');
    });

    it('should reject phone without +52 prefix when starting with digit', () => {
      const result = validateIdentifier('3314530322');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('El teléfono debe iniciar con +52');
    });

    it('should detect phone when starting with +52', () => {
      const result = validateIdentifier('+52331453032');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('El teléfono debe tener 10 dígitos después de +52');
    });

    it('should detect email when starting with letter', () => {
      const result = validateIdentifier('user@');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('El formato del email no es válido');
    });

    it('should trim whitespace before validation', () => {
      const emailResult = validateIdentifier('  test@example.com  ');
      expect(emailResult.isValid).toBe(true);

      const phoneResult = validateIdentifier('  +523314530322  ');
      expect(phoneResult.isValid).toBe(true);
    });
  });
});
